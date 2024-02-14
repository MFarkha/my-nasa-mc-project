const { 
    getAllLaunches,
    // addNewLaunch,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId 
} = require('../../models/launches.model');

const httpGetAllLaunches = async (req, res) => {
    return res.status(200).json(await getAllLaunches());
}

const httpAddNewLaunch = async (req, res) => {
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
    // addNewLaunch(launch);
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

const httpAbortLaunch = async (req, res) => {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);
    if (!existsLaunch) {
        return res.status(404).json({
            error: `Launch not found`
        });
    } else {
        const aborted = await abortLaunchWithId(launchId);
        if (!aborted) {
            return res.status(400).json({
                error: 'Something wrong happened: the launch has not been aborted'
            });
        }
        return res.status(200).json({
            ok: true
        });
    }
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}