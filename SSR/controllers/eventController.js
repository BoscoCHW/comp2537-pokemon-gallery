const Event = require("../models/Event");

const eventController = {
  getAllEvents: async (req, res) => {
    const allEvents = await Event.find();
    res.json(allEvents);
  },

  getOneEvent: async (req, res) => {
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
  },

  incrementEventVote: async (req, res) => {
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
  },

  decrementEventVote: async (req, res) => {
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
  },

  createEvent: async (req, res) => {
    const { datetime, text } = req.body;
    try {
      const newEvent = await Event.create({ datetime, text, user: req.session.user._id });
      res.json(newEvent);
    } catch (e) {
      console.log(e.message);
      res.status(500);
      res.json(e);
    }
  },

  updatedEvent: async (req, res) => {
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
  },
  
  deleteEvent: async (req, res) => {
    const { id } = req.params;
    const result = await Event.deleteOne({ _id: id });
    res.json(result);
  },
};

module.exports = eventController;
