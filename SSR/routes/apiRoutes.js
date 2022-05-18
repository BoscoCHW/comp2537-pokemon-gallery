const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/events", async (req, res) => {
  const allEvents = await Event.find();
  res.json(allEvents);
});

router.get("/events/:id", async (req, res) => {
  const { id } = req.params;
  let targetEvent;

  try {
    targetEvent = await Event.findOne({ _id: id }).exec();
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Something went wrong." });
  }

  if (!targetEvent) {
    res.status(404).send({ message: `no event with id ${id}` });
  } else {
    res.json(targetEvent);
  }
});

router.get("/events/incrementVote/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $inc: { hits: 1 } },
      { new: true }
    ).exec();
    res.json(updatedEvent);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/events/decrementVote/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $inc: { hits: -1 } },
      { new: true }
    ).exec();
    res.json(updatedEvent);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/events", async (req, res) => {
  const { datetime, text } = req.body;
  try {
    const newEvent = await Event.create({ datetime, text });
    res.json(newEvent);
  } catch (e) {
    console.log(e.message);
    res.status(500);
    res.json(e);
  }
});

router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { datetime, text, hits } = req.body;
  const targetEvent = await Event.findOne({ _id: id }).exec();
  if (!targetEvent) {
    res.status(404).send({ message: `no event with id ${id}` });
  }

  targetEvent.datetime = datetime ? datetime : targetEvent.datetime;
  targetEvent.text = text ? text : targetEvent.text;
  targetEvent.hits = hits ? hits : targetEvent.hits;
  try {
    const updatedEvent = await targetEvent.save();
    res.json(updatedEvent);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Event.deleteOne({ _id: id });
  res.json(result);
});


module.exports = router;