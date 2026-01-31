const mongoose = require('mongoose');
const sourceSchema = require('./source');
const chatHistorySchema = require('./chatHistory');

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
    summary: {
      type: String
    },
    source: { 
      type: sourceSchema, 
      default: () => ({ urls: [], documents: [] }) 
    },
    chatHistory: {
      type: Map,
      of: chatHistorySchema,
      default: {}
    }
  },
  { _id: false }
);

module.exports = notebookSchema;