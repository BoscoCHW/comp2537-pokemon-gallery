const fetch = require("node-fetch");
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/search", (req, res) => {
  res.render("search");
});

router.get("/profile/:id", async (req, res) => {
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

  console.log(pokemon);
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

  res.render("profile", { pokemon: pokeinfo });
});

router.get("/eventHistory", async (req, res) => {
  const allEvents = await Event.find();
  allEvents.reverse();

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
  res.render("events", { events });
});


module.exports = router;