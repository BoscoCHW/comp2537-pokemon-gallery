require("dotenv").config();
const express = require("express");
const p1 = require("./data/1.json");
const p4 = require("./data/4.json");
const fire = require("./data/fire.json");
const allTypes = require("./data/all_types.json");
const cors = require("cors");
const db = require("./config/database");
const Event = require("./models/events");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
db.connect(process.env.MONGO_URI);

app.get("/api/v2/pokemon/:id", (req, res) => {
  const { id } = req.params;
  const data = [p1, p4];
  let index = ["1", "4"].indexOf(id);
  if (index == -1) index = Math.floor(Math.random() * 2);
  res.json(data[index]);
});

app.get("/api/v2/pokemon", (req, res) => {
  const { limit } = req.query;
  console.log(limit);
  res.json(allTypes);
});

app.get("/api/v2/type/:type", (req, res) => {
  const { type } = req.params;
  console.log(type);
  res.json(fire);
});

app.get("/events", async (req, res) => {
  const allEvents = await Event.find();
  res.json(allEvents);
});

app.get("/events/:id", async (req, res) => {
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

app.get("/events/incrementVote/:id", async (req, res) => {
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

app.get("/events/decrementVote/:id", async (req, res) => {
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

app.post("/events", async (req, res) => {
  console.log(req.body);
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

app.put("/events/:id", async (req, res) => {
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

app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Event.deleteOne({ _id: id });
  res.json(result);
});

app.listen(3000, () => console.log("Server listening on port 3000."));
