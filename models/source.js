const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        urlID: String,
        url: String,
        homeUrl: String,
        date: { type: Date, default: Date.now }
    },
    { _id: false });

const documentSchema = new mongoose.Schema(
    {
        fileID: String,
        filename: String,
        filesize: String,
        date: { type: Date, default: Date.now }
    }, 
    { _id: false });

const sourceSchema = new mongoose.Schema(
    {
        urls: [urlSchema],
        documents: [documentSchema]
    }, 
    { _id: false });

module.exports = sourceSchema;