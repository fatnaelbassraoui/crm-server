const mongoose = require("mongoose");

const calenderFormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    start: {
      type: Date,
      require: true,
    },
    end: {
      type: Date,
      require: true,
    },
    description: {
      type: String,
      require: true,
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
