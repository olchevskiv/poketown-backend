import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
   address: {type: String, required: true},
   city: {type: String, required: true},
   zipCode: {type: String, required: true},
   state: {type: String, required: true},
   country: {type: String, required: true},
   daysOpen: {type: Array, required: true},
   hourOpenStart:{type: Number, required: true},
   hourOpenEnd:{type: Number, required: true},
   lastUpdated: {type: Date, required: true}
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;