import mongoose, { InferSchemaType } from "mongoose";


const ingredientSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    category: { type: String, enum: ['BASE','MIXIN','PROTEIN','TOPPING','SAUCE'], required: true },
    description: { type: String },
    image_url: { type: String, required: true },
    calories: { type: Number, required: true },
    price: { type: Number, required: true },
    lastUpdated: {type: Date}
});

export type IngredientType = InferSchemaType<typeof ingredientSchema>;

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;