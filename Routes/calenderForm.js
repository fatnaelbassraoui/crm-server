const express = require("express");
const CalenderForm = require("../Models/calenderForm");
const Customers = require("../Models/customers");
const moment = require("moment")
const router = express.Router();

router.get("/event", async (req, res) => {
  try {
    const newEvent = await CalenderForm.find();
    res.status(200).send(newEvent);
  } catch (error) {
    res.status(500).send({
      message: "an error is occurred",
    });
  }
});

router.post("/newEvent", async (req, res) => {
  const newEvent = new CalenderForm({
    title: req.body.title,
    start: moment(req.body.start).toDate(),
    end: moment(req.body.end).toDate(),
    description: req.body.description,
  });

  try {
    const saveNewEvent = await newEvent.save();
    res.status(200).send({
      message: "event added successfully",
      payload: saveNewEvent,
    });
  } catch (error) {
    res.status(500).send({
      message: "an error is occurred",
      error: error,
    });
  }
});

router.delete("/event/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const event = await CalenderForm.findById(id).deleteOne();
    if (!event)
      return res.status(404).send(`The event with id ${id} does not exist`);
    res.status(200).send("event deleted successfully");
  } catch (error) {
    res.status(500).send({
      message: "Event can't be deleted",
      error: error,
    });
  }
});

router.patch("/event/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateEvent = req.body;
    const options = { new: true };

    const newEvent = await CalenderForm.findByIdAndUpdate(
      id,
      updateEvent,
      options
    );
    if (!newEvent) return res.status(404).send(`Event with id ${id} not found`);

    res.status(200).send({
      message: "Event info updated successfully",
      payload: newEvent,
    });
  } catch (error) {
    res.status(500).send({
      message: "an error has occurred",
      error: error,
    });
  }
});

router.post("/patientEvent/:id", async (req, res) => {
  const { id } = req.params;
  const { title, startEvent } = req.body;

  try {
    const assignEventToPatient = await Customers.findByIdAndUpdate(
      id,
      {
        $push: {
          patientEvent: {
            title,
            startEvent,
          },
        },
      },
      { new: true }
    );
    res.status(200).send({
      message: "event registered successfully",
      payload: assignEventToPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "an error is occurred",
      error: error,
    });
  }
});

module.exports = router;
