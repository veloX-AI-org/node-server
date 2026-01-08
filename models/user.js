const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    fname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    provider: {
        type: String
    },
    passwordHash: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null,
        index: true
    },
    googleImageURL: {
        type: String || null
    }
});

module.exports = mongoose.model("user", userSchema);