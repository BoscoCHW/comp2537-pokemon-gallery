const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopItemSchema = new Schema(
  {
    pokemonId: { 
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("ShopItem", shopItemSchema);