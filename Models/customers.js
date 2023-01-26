const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema(
  {
    patientFirstName: {
      type: String,
      required: true,
    },
    patientLastName: {
      type: String,
      required: true,
    },
    patientDateOfBirth: {
      type: Date,
      required: true,
    },
    patientPhoneNumber: {
      type: String,
      required: true,
    },
    patientAddress: {
      type: String,
      required: true,
    },
    patientAddress: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    patientTreatments: {
      type: Array,
      required: false,
    },
    assistedByDoctor: {
      type: Array,
      require: false,
      default: undefined,
    },
    patientEvent: {
      type: Array,
      required: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("customersModel", customersSchema, "customers");
