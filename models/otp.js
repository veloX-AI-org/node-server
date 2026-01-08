const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    email: {
        type: String, 
        require: true
    },
    otp: {
        type: String, 
        require: true
    },
    expiresAt: {
        type: Date, 
        require: true
    },
    verified: {
        type: Boolean, 
        default: false
    }
})


const otpSchema = mongoose.model("otp", Schema);

module.exports = otpSchema;