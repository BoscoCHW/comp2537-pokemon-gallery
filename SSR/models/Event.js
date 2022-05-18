const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    datetime: {
      type: Date,
      default: () => Date.now(),
    },
    text: {
      type: String,
      required: true,
    },
    hits: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
