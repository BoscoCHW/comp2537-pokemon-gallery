const Event = require("../models/Event");
const Order = require("../models/Order");
const ShopItem = require("../models/ShopItem");

const cartController = {
  addShopItem: async (req, res) => {
    let { pokemonId } = req.body;

    try {
      const order = await Order.findOne({
        user: req.session.user._id,
        checkedOut: false,
      }).exec();
      const cartItems = await ShopItem.find({ order: order._id });

      const targetPokemonCartItem = cartItems.find(
        (cartItem) => cartItem.pokemonId === pokemonId
      );

      if (targetPokemonCartItem) {
        targetPokemonCartItem.quantity += 1;
        await targetPokemonCartItem.save();
      } else {
        const newPokemonCartItem = await ShopItem.create({
          pokemonId,
          price: Number(pokemonId),
          quantity: 1,
          order: order._id,
        });
        cartItems.push(newPokemonCartItem);
      }

      res.json(cartItems);
    } catch (e) {
      console.log(e);
      res.json(e);
    }
  },

  getShoppingCartItems: async (req, res) => {
    const userId = req.session.user._id;

    const shoppingCart = await Order.findOne({
      user: userId,
      checkedOut: false,
    }).exec();
    const cartItems = await ShopItem.find({ order: shoppingCart._id });
    res.json(cartItems);
  },

  checkout: async (req, res) => {
    const userId = req.session.user._id;
    const shoppingCart = await Order.findOneAndUpdate(
      {
        user: userId,
        checkedOut: false,
      },
      { checkedOut: true },
      { new: true }
    ).exec();
    Order.create({ user: userId });
    Event.create({
      text: "User checked out the shopping cart.",
      user: req.session.user._id,
    });
    res.json(shoppingCart);
  },
};

module.exports = cartController;
