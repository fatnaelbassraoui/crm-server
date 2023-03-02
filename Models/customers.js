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
    patientEmail: {
      type: String,
      required: true,
    },
    patientTreatments: {
      type: Array,
      required: false,
    },
    patientAvatar: {
      type: String,
      required: false,
      default: 'https://i.pinimg.com/564x/1e/c8/8f/1ec88f15c78ec8cc96175c51202a0416.jpg'

    },
    assistedByDoctor: {
      type: Array,
      require: false,
      default: undefined,
    }
  },
  {
    timestamps: true, strict: true // strict: true ci permette di evitare che vengano salvati campi non definiti nel modello
  }
);
customersSchema.pre("save", async function (next) {  // il pre ci consente di eseguire una funzione prima di eseguire un'altra. In questo caso prima di salvare un nuovo customer, eseguiamo la funzione che ci permette di verificare se esiste già un customer con lo stesso nome e cognome. Se esiste già, non lo salviamo e ritorniamo un errore.
  const existingCustomer = await this.constructor.findOne({
    patientEmail: this.patientEmail,
    patientLastName: this.patientLastName
  });
  if (existingCustomer) {
    return next(new Error("Customer already exists"));
  }
});
module.exports = mongoose.model("customersModel", customersSchema, "customers");
