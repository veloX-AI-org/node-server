const mongoose = require('mongoose');
const sourceSchema = require('./source');

const notebookSchema = new mongoose.Schema(
  {
    notebookID: {
      type: String
    },
    name: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    totalSources: {
        type: Number,
        default: 0
    },
    source: sourceSchema,
    chatHistory: [String]
  },
  { _id: false }
);

module.exports = notebookSchema;