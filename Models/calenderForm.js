const mongoose = require("mongoose");

const calenderFormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    allDay:{
      type: Boolean,
      default: false,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "calenderFormModel",
  calenderFormSchema,
  "calenderForm"
);
