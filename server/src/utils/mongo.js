require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready')
});

mongoose.connection.on('error', (err) => {
    console.error(err)
});

const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URI);
    } catch(err) {
        throw new Error('Cound not connect a MongoDB host, did you properly set up MONGO_ATLAS_URI variable? ', err);
    }
}

const mongoDisconnect = async () => {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}
