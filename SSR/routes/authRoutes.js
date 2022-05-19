const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.loginPage);
router.get("/register", authController.registerPage);

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/logout", authController.logout)

module.exports = router;