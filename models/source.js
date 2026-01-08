const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
  {
    url: {
        type: Map,
        of: {
            urlID: String,
            url: String
        },
        default: {}
    },
    document: {
        type: Map,
        of: { 
            fileID: String,
            filename: String,      
            filetype: String,
            filesize: String,
            path: String          
        },
        default: {}
    }
  },
  { _id: false }
);

module.exports = sourceSchema;