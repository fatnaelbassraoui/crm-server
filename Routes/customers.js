const express = require("express");
const Customers = require("../Models/customers");
const router = express.Router();
const { check, validationResult } = require("express-validator");


router.get("/customers", async (req, res) => {
  try {
    const registeredCustomers = await Customers.find();
    res.status(200).send(registeredCustomers);
  } catch (error) {
    res.status(500).send({
      message: "an error occurred",
    });
  }
});

router.post(
  "/newCustomers",
  [
    check("patientFirstName", "patientFirstName is required")
      .trim()
      .exists()
      .withMessage("patientFirstName is required")
      .isLength({ min: 3 })
      .withMessage("patientFirstName must be at least 3 chars long"),

    check("patientLastName", "patientLastName is required")
      .trim()
      .exists()
      .withMessage("patientLastName is required")
      .isLength({ min: 3 })
      .withMessage("last must be at least 3 chars long"),

    check("patientEmail", "patientEmail is required")

      .trim()
      .exists()
      .isEmail()
      .withMessage("invalid email address")
      .normalizeEmail()

  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ error: error.array() });
    }

    const addCustomer = new Customers({
      patientFirstName: req.body.patientFirstName,
      patientLastName: req.body.patientLastName,
      patientDateOfBirth: req.body.patientDateOfBirth,
      patientPhoneNumber: req.body.patientPhoneNumber,
      patientAddress: req.body.patientAddress,
      patientEmail: req.body.patientEmail,
      patientTreatments: req.body.patientTreatments,
    });
    try {
      await addCustomer.save();
      res.status(200).send({
        message: "registration successfully",
        payload: saveNewCustomer,
      });

    } catch (error) {
      if (addCustomer.patientEmail === req.body.patientEmail && addCustomer.patientLastName === req.body.patientLastName) {
        // return res.status(400).send({
        //   message: "patientLastName/patientEmail already exists",
        //   payload: error,
        res.status(500).send({
          message: "an error occurred",
          error: error,

        });
      }
    }
  }
);

router.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customers.findById(id).deleteOne();
    if (!customer) {
      return res.status(404).send(`the User with id ${id} does not exist`);
    } else {
      res.status(200).send("user deleted successfully");
    }
  } catch (error) {
    res.status(500).send({
      message: "User can't be deleted",
      error: error,
    });
  }
});

router.patch("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateCustomer = req.body;
    const options = { new: true };
    const result = await Customers.findByIdAndUpdate(
      id,
      updateCustomer,
      options
    );
    if (!result) return res.status(404).send(`user with id ${id} not found`);
  } catch (error) { }
});

router.post("/assistedByDoctor/:id", async (req, res) => {
  const { id } = req.params;
  const { doctorName, doctorLastName, doctorId } = req.body;

  try {
    const assignDoctor = await Customers.findByIdAndUpdate(
      id,
      {
        $push: {
          assistedByDoctor: {
            doctorName,
            doctorLastName,
            doctorId,
          },
        },
      },
      { new: true }
    );
    res.status(200).send({
      message: "doctor assigned successfully",
      payload: assignDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error is occurred",
      error: error,
    });
  }
});

module.exports = router;
