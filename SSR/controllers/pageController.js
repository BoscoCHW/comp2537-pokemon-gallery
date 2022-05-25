const Event = require("../models/Event");
const fetch = require("node-fetch");
const Order = require("../models/Order");
const ShopItem = require("../models/ShopItem");

const pageController = {
  homePage: (req, res) => res.render("index", { user: req.session.user }),
  searchPage: (req, res) => {
    res.render("search", { user: req.session.user });
  },
  profilePage: async (req, res) => {
    const statMaxVal = {
      hp: 100,
      attack: 100,
      defense: 100,
      "special-attack": 200,
      "special-defense": 200,
      speed: 150,
      height: 20,
      weight: 1000,
    };
    const titleCase = (aString) => aString[0].toUpperCase() + aString.slice(1);
    const formatStatsAttributeName = (attributeName) => {
      const nameTokens = attributeName
        .split("-")
        .map((nameToken) => titleCase(nameToken));
      return nameTokens.join(" ");
    };
    const normalizeStat = (attribute, val) => {
      return val / statMaxVal[attribute];
    };

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
    const response = await fetch(url);
    const pokemon = await response.json();

    const { id, name, height, weight, stats, abilities, sprites } = pokemon;

    const statistics = stats.map((stat) => ({
      attribute: formatStatsAttributeName(stat.stat.name),
      val: normalizeStat(stat.stat.name, stat.base_stat),
    }));

    statistics.push(
      { attribute: "height", val: normalizeStat("height", height) },
      { attribute: "weight", val: normalizeStat("weight", weight) }
    );
    const pokeinfo = {
      id,
      name: titleCase(name),
      imageUrl: sprites.other["official-artwork"].front_default,
      statistics,
      abilities: abilities.map((ability) => titleCase(ability.ability.name)),
    };

    res.render("profile", { pokemon: pokeinfo, user: req.session.user });
  },

  accountPage: async (req, res) => {
    const allEvents = await Event.find({ user: req.session.user._id }).exec();
    allEvents.reverse();

    const allPrevOrder = await Order.find({
      user: req.session.user._id,
      checkedOut: true,
    }).exec();
    allPrevOrder.reverse();

    const previousOrders = [];
    for (let prevOrder of allPrevOrder) {
      const items = await ShopItem.find({ order: prevOrder._id });
      const order = {
        items,
        total: items.reduce((acc, item) => acc + item.subtotal, 0),
      };
      previousOrders.push(order);
    }

    const events = allEvents.map((eventData) => {
      const dateObj = new Date(eventData.datetime);

      const event = {
        id: eventData._id,
        time: dateObj.toLocaleString("en-GB", {
          timeZone: "Canada/Pacific",
          dateStyle: "medium",
          timeStyle: "medium",
        }),
        text: eventData.text,
        hits: eventData.hits,
      };

      return event;
    });
    res.render("events", {
      events,
      user: req.session.user,
      previousOrders,
    });
  },

  shoppingCartPage: async (req, res) => {
    res.render("shoppingCart", { user: req.session.user });
  },

  gamePage: (req, res) => {
    res.render("game");
  },

  dashboardPage: (req, res) => {
    res.render("dashboard");
  },
};

module.exports = pageController;
