const mongoose = require('mongoose');

const contectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected -> ${process.env.MONGO_URL}`);
    } catch {
        console.log("Failed to connect to cloud database");
        mongoose.connect("mongodb://127.0.0.1:27017/veloX");
        console.log("Connected to local database");
    }
};

module.exports = contectDB;