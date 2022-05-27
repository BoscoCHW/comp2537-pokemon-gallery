
const express = require("express");
const router = express.Router();

const {ensureAuthenticated, isAdmin} = require("../middlewares/checkAuth")
const pageController = require("../controllers/pageController");

router.get("/", ensureAuthenticated, pageController.homePage);

router.get("/search", ensureAuthenticated, pageController.searchPage);

router.get("/profile/:id", ensureAuthenticated, pageController.profilePage);

router.get("/account", ensureAuthenticated, pageController.accountPage);

router.get("/shoppingCart", ensureAuthenticated, pageController.shoppingCartPage)

router.get("/memoryGame", ensureAuthenticated, pageController.gamePage);

router.get("/adminDashboard", ensureAuthenticated, isAdmin, pageController.dashboardPage);

module.exports = router;
