const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL="https://api.spacexdata.com/v4/launches/query"

const populateLaunches = async () => {
    console.log("Downloading data from SpaceX Api...");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });
    if (response.status!=200) {
        throw new Error('Problem downloading SpaceX data');
    }
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const launch = {
            flightNumber: launchDoc.flight_number,
            rocket: launchDoc.rocket.name,
            mission: launchDoc.name,
            launchDate: launchDoc.date_local,
            target: "not applicable",
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers: launchDoc.payloads.flatMap((payload) => {
                return payload.customers
            })
        }
        await saveLaunch(launch);
    }
}

const loadLaunchesData = async () => {
    // check if SpaceX data already exists in Mongo db
    const exists = await findLaunch({
        flightNumber: 1,
        mission: "FalconSat",
        rocket: "Falcon 1"
    });
    if (exists) {
        console.log("No need to download the SpaceX data");
    } else {
        await populateLaunches();
    }
}
// our data vs spacex data
// flightNumber: flight_number
// rocket: rocket.name
// mission: name
// launchDate: date_local
// target: not applicable
// upcoming: upcoming
// success: success
// customers: payloads[].customers[0]

const saveLaunch = async (launch) => {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

const getAllLaunches = async (skip, limit) => {
    return await launchesDatabase
        .find({}, { "_id": 0, "__v": 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}

const findLaunch = async (filter) => {
    return await launchesDatabase.findOne(filter);
}

const existsLaunchWithId = async (launchId) => {
    return await findLaunch({
        flightNumber: launchId
    })
}

const abortLaunchWithId = async (launchId) => {
    const resultAbort = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    return resultAbort.matchedCount === 1 && resultAbort.modifiedCount === 1;
}

const getLatestFlightNumber = async () => {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

const scheduleNewLaunch = async (launch) => {
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['NASA', 'NOAA'],
        upcoming: true,
        success: true,
    })
    const planet = await planets.findOne({
        keplerName: newLaunch.target
    });
    if (planet) {
        await saveLaunch(newLaunch);
    } else {
        throw new Error('No matching planet is found');
    }

}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId,
    loadLaunchesData,
}