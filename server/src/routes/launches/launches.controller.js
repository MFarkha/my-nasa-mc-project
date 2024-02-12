const { 
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId 
} = require('../../models/launches.model');

const httpGetAllLaunches = (req, res) => {
    return res.status(200).json(getAllLaunches());
}

const httpAddNewLaunch = (req, res) => {
    let launch = req.body;
    if (!launch.mission
        || !launch.launchDate 
        || !launch.target
        || !launch.rocket){
        return res.status(400).json({
            error: 'Missing input data property'
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid date format"
        })
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

const httpAbortLaunch = (req, res) => {
    const launchId = Number(req.params.id);
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: `Launch not found`
        });
    } else {
        const aborted = abortLaunchWithId(launchId);
        return res.status(200).json(aborted);
    }
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}