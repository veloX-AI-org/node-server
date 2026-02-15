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
    summary: {
      summary: { type: String, default: "" },
      questions: { type: [String], default: []}
    },
    source: { 
      type: sourceSchema, 
      default: () => ({ urls: [], documents: [] }) 
    },
    chatHistory: {
      type: [{
        role: String,
        content: String
      }],
      default: []
    }
  },
  { _id: false }
);

module.exports = notebookSchema;