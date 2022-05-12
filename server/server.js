require("dotenv").config();
const express = require("express");
const p1 = require("./data/1.json");
const p4 = require("./data/4.json");
const fire = require("./data/fire.json");
const allTypes = require("./data/all_types.json");
const cors = require("cors");
const db = require("./config/database")
const app = express();

app.use(cors());
app.use(express.json());
db.connect(process.env.MONGO_URI);

app.get("/api/v2/pokemon/:id", (req, res) => {
  const data = [p1, p4];
  const randomNum = Math.floor(Math.random() * 2);
  res.json(data[randomNum]);
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

app.listen(3000, () => console.log("Server listening on port 3000."));
