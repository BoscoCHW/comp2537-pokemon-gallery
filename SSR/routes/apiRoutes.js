const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/events", eventController.getAllEvents);

router.get("/events/:id", eventController.getOneEvent);

router.get("/events/incrementVote/:id", eventController.incrementEventVote);

router.get("/events/decrementVote/:id", eventController.decrementEventVote);

router.post("/events", eventController.createEvent);

router.put("/events/:id", eventController.updatedEvent);

router.delete("/events/:id", eventController.deleteEvent);

module.exports = router;
