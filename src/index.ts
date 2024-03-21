import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import myUserRoute from "./routes/MyUserRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import menuItemRoute from "./routes/menu/MenuItemRoute";
import ingredientRoute from "./routes/menu/IngredientRoute";

mongoose.connect(process.env.MONGODB_CONNECT_STRING as string).then(()=> console.log('Connected to database'));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', async(rreq:Request, res:Response)=>{
    res.send({message: "Server is up!"})
});

app.use("/api/my/user", myUserRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/menu-item", menuItemRoute);
app.use("/api/ingredient", ingredientRoute);

app.listen(7000, ()=>{
    console.log('Server started on localhost:7000');
});