const mongoose = require('mongoose');
const notebookSchema = require('./notebook');

const userSchema = mongoose.Schema({
    username: {
        type: String
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        requiredd: true,
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
    },
    notebooks: {
        type: Map,
        of: notebookSchema,
        default: {}
    }
});

module.exports = mongoose.model("user", userSchema);