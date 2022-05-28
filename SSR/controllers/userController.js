const User = require("../models/User");
const Order = require("../models/Order");
const Event = require("../models/Event");

const userController = {
  addUser: async (req, res) => {
    const { firstname, lastname, email, password, isAdmin } = req.body;

    try {
      const newUser = new User({
        firstname,
        lastname,
        email,
        password,
        isAdmin,
      });
      const newUserFromDB = await newUser.save();
      const newOrder = new Order({ user: newUserFromDB._id });
      await newOrder.save();
      res.json(newUserFromDB);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;
    const isAdmin = req.body.isAdmin == "1";
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          firstname,
          lastname,
          email,
          password,
          isAdmin,
        },
        { new: true }
      ).exec();
      res.json(updatedUser);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const deletedUser = await User.findByIdAndRemove(id).exec();
      Event.create({
        user: req.session.user._id,
        text: `Admin deleted user ${deletedUser.firstname}.`,
      });
      res.json(deletedUser);
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  },
};

module.exports = userController;
