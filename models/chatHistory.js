const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

module.exports = chatHistorySchema;