
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
  
const create = async (req: Request, res: Response) => {
    try {
        const { address, city, zipCode, country } = req.body;

        const existingRestaurant = await Restaurant.find({
            address: address,
            city: city,
            zipCode: zipCode,
            country: country,
        });

        // Check if Restauarnt at this address has already been created
        if(existingRestaurant) {
            return res.status(409).json({message:"Restaurant already exists"});
        }

        // Create user if they dont exist
        const newRestaurant = new Restaurant({
            address: address,
            city: city,
            zipCode: zipCode,
            country: country,
            lastUpdated: new Date()
        });
        await newRestaurant.save();

        return res.status(201).json(newRestaurant.toObject());

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error creating restaurant"});
    }
};

export default {
    create,
};
