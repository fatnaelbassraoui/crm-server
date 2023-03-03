const mongoose = require("mongoose");

const SignUpSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "User",
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://i.pinimg.com/564x/1e/c8/8f/1ec88f15c78ec8cc96175c51202a0416.jpg'

    },
  },

  {
    timestamps: true,
  }
);
SignUpSchema.pre("save", async function (next) {  // il pre ci consente di eseguire una funzione prima di eseguire un'altra. In questo caso prima di salvare un nuovo customer, eseguiamo la funzione che ci permette di verificare se esiste già un customer con lo stesso nome e cognome. Se esiste già, non lo salviamo e ritorniamo un errore.
  const existingUser = await this.constructor.findOne({
    email: this.email,
    lastName: this.lastName
  });
  if (existingUser) {
    return next(new Error("User already exists"));
  }
});

module.exports = mongoose.model("signUpModel", SignUpSchema, "signUpUsers");
