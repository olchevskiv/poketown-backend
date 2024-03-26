import { Request, Response } from "express";
import MenuItem from "../models/menuItem";
import Ingredient from "../models/ingredient";
import cloudinary from "cloudinary";
import mongoose from "mongoose";


const getByID = async (req: Request, res: Response) => {
    try {
        const menuItemID = req.params.menuItemID;

       /* if(mongoose.isValidObjectId(menuItemID)){
            return res.status(404).json({ message: "Could not find menu item"});
        }*/

        const menuItem = await MenuItem.findById(menuItemID).populate("ingredients");
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.json(menuItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting menu item" });
    }
}; 

const getAll = async (req: Request, res: Response) => {
    try {
        const menuItems = await MenuItem.find();

        res.json(menuItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting menu items" });
    }
};

const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

const create = async (req: Request, res: Response) => {
    try {
        const { name, category, description, price } = req.body;

        const existingMenuItem = await MenuItem.findOne({
            'name': name,
            'category': category
        });

        // Check if menu item has been created
        if(existingMenuItem) {
            return res.status(409).json({message:req.body.name+" already exists"});
        }

        // Upload image (if provided) for menu item
        let imageUrl = '';
        if (req.file) {
            imageUrl = await uploadImage(req.file as Express.Multer.File);
        }

        // Get ingredient objects
        let ingredients = await Ingredient.find({ _id: req.body.ingredients});

        // Create menu item if they dont exist
        const newMenuItem = new MenuItem({
            name: name,
            category: category,
            price: price,
            description: description,
            ingredients: ingredients,
            image_url: imageUrl,
            lastUpdated: new Date()
        });
        await newMenuItem.save();

        return res.status(201).json(newMenuItem.toObject());

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error creating menu item"});
    }
};


export default {
    create,
    getByID,
    getAll
};
