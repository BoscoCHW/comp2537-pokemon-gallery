require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const db = require("./config/database");
const session = require("express-session");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.body)
  console.log(req.session);
  next();
});

const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/api", apiRoutes)

db.connect(process.env.MONGO_URI)

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}.`);
});
