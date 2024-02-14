const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

// const initialLaunch = {
//     flightNumber: 100,
//     mission: "Kepler Exploration X",
//     rocket: "Explorer IS1",
//     launchDate: new Date('Dec 27, 2030'),
//     target: 'Kepler-452 b',
//     customers: ['NASA', 'NOAA'],
//     upcoming: true,
//     success: true
// }

const saveLaunch = async (launch) => {
    const planet = await planets.findOne({
        keplerName: launch.target
    });
    if (planet) {
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, {
            upsert: true
        });
    } else {
        throw new Error('No matching planet is found');
    }
}
// saveLaunch(initialLaunch);

const getAllLaunches = async () => {
    return await launchesDatabase.find({}, {
        "_id": 0,
        "__v": 0,
    });
}

const existsLaunchWithId = async (launchId) => {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
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
    await saveLaunch(newLaunch);
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId,
}