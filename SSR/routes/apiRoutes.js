const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const cartController = require("../controllers/cartController");
const { ensureAuthenticated, isAdmin } = require("../middlewares/checkAuth");
const userController = require("../controllers/userController");

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

router.post("/user/create", ensureAuthenticated, isAdmin, userController.addUser)

router.put("/user/update/:id", ensureAuthenticated, isAdmin, userController.updateUser)

router.delete("/user/remove/:id", ensureAuthenticated, isAdmin, userController.deleteUser)


module.exports = router;
