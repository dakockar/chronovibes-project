const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');
require('./User.model.js')

const entrySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  entryBody: {
    type: String,
    required: true
  },
  tags: [String],
  time: {
    type: Date,
    default: Date.now
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

});

const Entry = model("Entry", entrySchema);

module.exports = Entry;
