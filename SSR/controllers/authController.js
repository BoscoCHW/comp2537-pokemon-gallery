const User = require("../models/User");

const authController = {
  loginPage: (req, res) => {
    res.render("login");
  },

  registerPage: (req, res) => {
    res.render("register");
  },

  loginUser: async (req, res) => {
    const {email, password} = req.body;
    const user = await User.find({email, password}).exec();
    if (user) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.redirect("/auth/login");
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
      await newUser.save();

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
