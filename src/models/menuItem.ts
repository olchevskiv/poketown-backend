import mongoose, { InferSchemaType } from "mongoose";


const menuItemSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    baseCalories: { type: Number, required: true },
    category: { type: String, enum: ['BOWL','SIDE','BEVERAGE'], required: true },
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: "Ingredient"}],
    image_url: { type: String},
    lastUpdated: {type: Date}
});

export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;