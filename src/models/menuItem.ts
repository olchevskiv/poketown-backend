import mongoose from "mongoose";


const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['BOWL','SIDE','BEVERAGE'], required: true },
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: "Ingredient"}],
    image_url: { type: String},
    lastUpdated: {type: Date}
});


const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;