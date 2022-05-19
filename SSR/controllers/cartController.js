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

      const targetPokemonCartItem = cartItems.find((cartItem) => cartItem.pokemonId === pokemonId);

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
};

module.exports = cartController;
