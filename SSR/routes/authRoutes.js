const express = require("express");
const {forwardAuthenticated} = require("../middlewares/checkAuth")
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", forwardAuthenticated, authController.loginPage);
router.get("/register", forwardAuthenticated, authController.registerPage);

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.get("/logout", authController.logout)

module.exports = router;