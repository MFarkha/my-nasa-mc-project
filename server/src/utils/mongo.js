require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready')
});

mongoose.connection.on('error', (err) => {
    console.error(err)
});

const mongoConnect = async () => {
    await mongoose.connect(process.env.MONGO_ATLAS_URI);
}

const mongoDisconnect = async () => {
    await mongoose.disconnect();
}

const initDatabase = async () => {
    
}
module.exports = {
    mongoConnect,
    mongoDisconnect
}
