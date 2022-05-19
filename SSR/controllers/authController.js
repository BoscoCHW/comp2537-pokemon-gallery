const User = require("../models/User");
const Order = require("../models/Order");

const authController = {
  loginPage: (req, res) => {
    res.render("login", { error: false });
  },

  registerPage: (req, res) => {
    res.render("register");
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }).exec();
    console.log(user);
    if (user) {
      req.session.isAuthenticated = true;
      req.session.user = user;
      res.redirect("/");
    } else {
      res.render("login", { error: true });
    }
  },

  registerUser: async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    try {
      const newUser = new User({
        firstname,
        lastname,
        email,
        password,
      });
      const newUserFromDB = await newUser.save();

      const newOrder = new Order({ items: [], user: newUserFromDB._id });
      await newOrder.save();

      res.redirect("/auth/login");
    } catch (err) {
      console.log(err.message);
      res.redirect("/auth/register");
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
  },
};

module.exports = authController;
