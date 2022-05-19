const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const {ensureAuthenticated} = require("../middlewares/checkAuth")
const pageController = require("../controllers/pageController");

router.get("/", ensureAuthenticated, pageController.homePage);

router.get("/search", ensureAuthenticated, pageController.searchPage);

router.get("/profile/:id", ensureAuthenticated, pageController.profilePage);

router.get("/account", ensureAuthenticated, pageController.accountPage);

router.get("/shoppingCart", ensureAuthenticated, pageController.shoppingCartPage)

module.exports = router;
