import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cartItems: [
    {
      menuItemId: { type: String, required: false },
      isCustom: { type: Boolean, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: false },
      image_url: { type: String, required: false },
      ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: "Ingredient"}]
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "readyForPickup", "pickedUp"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;