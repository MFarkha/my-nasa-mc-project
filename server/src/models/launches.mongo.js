const mongoose = require('mongoose');

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    customers: {
        type: [ String ],
        required: true,
    },
    upcoming: {
        type: Boolean,
        default: true,
    },
    success: {
        type: Boolean,
        default: true,
    },
});

// connect launchSchema with the "launches" collection
module.exports = mongoose.model('Launch', launchSchema);