const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopItemSchema = new Schema(
  {
    PokemonCard: { 
      type: Object,
      required: true,
     },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("ShopItem", shopItemSchema);