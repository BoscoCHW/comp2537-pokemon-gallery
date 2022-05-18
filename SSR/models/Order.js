const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "ShopItem",
      },
    ],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    checkedOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
