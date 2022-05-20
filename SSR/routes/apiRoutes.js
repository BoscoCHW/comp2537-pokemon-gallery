const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const cartController = require("../controllers/cartController");

router.get("/events", eventController.getAllEvents);

router.get("/events/:id", eventController.getOneEvent);

router.get("/events/incrementVote/:id", eventController.incrementEventVote);

router.get("/events/decrementVote/:id", eventController.decrementEventVote);

router.post("/events", eventController.createEvent);

router.put("/events/:id", eventController.updatedEvent);

router.delete("/events/:id", eventController.deleteEvent);

router.post("/addShopItem", cartController.addShopItem);

router.get("/getShoppingCartItems", cartController.getShoppingCartItems);

router.get("/checkout", cartController.checkout);

router.get(
  "/shopItem/incrementQuantity/:id",
  cartController.incrementShopItemQuantity
);

router.get(
  "/shopItem/decrementQuantity/:id",
  cartController.decrementShopItemQuantity
);


module.exports = router;
