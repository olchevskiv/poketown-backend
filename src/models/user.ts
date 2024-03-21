import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth0Id: {type: String,required: true},
    email: {type: String,required: true},
    name: {type: String,},
    addressLine: {type: String,},
    city: {type: String,},
    zipCode: {type: String,},
    country: {type: String,},
    lastUpdated: {type: Date}
});
    
const User = mongoose.model("User", userSchema);
export default User;