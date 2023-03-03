const express = require("express"); // faccio l'import di express framework che serve per la creazione in node
const SignUp = require("../Models/signUp"); // si fa l'import del modello per riflettere lo schema di dati presente nel data base
const { check, validationResult } = require("express-validator");
const Bcrypt = require("bcrypt");

const router = express.Router(); // il router ci cerve per splittare il codice.

// I Modelli invece non sono altro che delle funzioni (costruttori) che permettono di costruire oggetti (basandoci su un determinato schema definito in precedenza) e di memorizzarli nella rispettiva collezione del database.

//si usa l'async perchè siamo in attesa di un dato che non è pronto subito. E'una promise (una promessa che un dato sarà caricato). Si mette il segna posto a js
router.get("/newUsers", async (req, res) => {
  //il try and catch serve per gestire gli errori
  try {
    const newUsers = await SignUp.find(); //si dice di usare il nostro modello e di restiture i dati presenti nel db. in questo caso tutti i dati
    res.status(200).send(newUsers); // send è un metodo che serve per gestire la nostra risposta
  } catch (error) {
    res.status(500).send({
      message: "an error has occurred",
    });
  }
});

//ci permette di leggere il body della req in forma json ed è uguale a express.js

router.post(
  "/addNewUsers",
  [
    check("userName", "userName is required")
      .trim()
      .exists()
      .withMessage("userName is required")
      .isLength({ min: 3 })
      .withMessage("userName must be at least 3 chars long"),
    check("email", "email is required")
      .trim()
      .exists()
      .isEmail()
      .withMessage("invalid email address")
      .normalizeEmail(),
    check("password", "password is required")
      .trim()
      .exists()
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long"),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ error: error.array() });
    }
    const salt = await Bcrypt.genSalt(10); // salt  l'algoritmo che cripta la password
    const cryptedPassword = await Bcrypt.hash(req.body.password, salt); //hash esegue la generazione della stringa e dell'algoritmo
    const newUsers = new SignUp({
      // qui sto istanziando una nuova classe di signUp, ovvero creo un nuovo modello di signUp
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      password: cryptedPassword,
      userName: req.body.userName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      avatar: req.body.avatar,
    });

    try {
      const saveNewUsers = await newUsers.save(); //il metodo mongoose ci permette di salvare l'oggetto creato
      res.status(200).send({
        message: "Registration successful",
        payload: saveNewUsers, //payload è un nome che si da ai dati. Si può chiamare diversamente
      });
    } catch (error) {
      return res.status(500).send({
        message: "userName/E-mail already exists",
        error: error,
      });

    }
  }
);

router.delete("/newUsers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await SignUp.findById(id).deleteOne();
    if (!user)
      return res.status(404).send(`the User with id ${id} does not exist`);
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    res.status(500).send({
      message: "User can't be deleted",
      error: error,
    });
  }
});

router.patch("/newUsers/:id", async (req, res) => {
  //  si puo sovrascrivere solo le proprietà che gli passiamo
  try {
    const { id } = req.params;
    const updateUser = req.body;
    const options = { new: true }; // con new:true gli dico di non mostrarmi più il dato vecchio ma quello nuovo

    const result = await SignUp.findByIdAndUpdate(id, updateUser, options);
    if (!result) return res.status(404).send(`user with id ${id} not found`);

    res.status(200).send({
      message: "user info updated successfully",
      payload: result,
    });
  } catch (error) {
    res.status(500).send({
      message: "an error has occurred",
      error: error,
    });
  }
});

module.exports = router;
