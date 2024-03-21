import { Request, Response } from "express";
import Ingredient from "../models/ingredient";
import cloudinary from "cloudinary";

  
const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

const create = async (req: Request, res: Response) => {
    try {
        const { name, category, description, calories, price } = req.body;

        const existingIngredient = await Ingredient.findOne({
            'name': name,
            'category': category
        });

        // Check if ingredient has been created
        if(existingIngredient) {
            return res.status(409).json({message:req.body.name+" already exists"});
        }

        const imageUrl = await uploadImage(req.file as Express.Multer.File);


        // Create ingredient if they dont exist
        const newIngredient = new Ingredient({
            name: name,
            category: category,
            description: description,
            calories: calories,
            price: price,
            image_url: imageUrl,
            lastUpdated: new Date()
        });
        await newIngredient.save();

        return res.status(201).json(newIngredient.toObject());

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error creating ingredient"});
    }
};

const getIngredients = async (req: Request, res: Response) => {
    try {
        const ingredients = await Ingredient.find();

        res.json(ingredients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting ingredients" });
    }
};


export default {
    create,
    getIngredients
};
