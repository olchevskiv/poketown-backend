
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
  
const create = async (req: Request, res: Response) => {
    try {
        const { address, city, zipCode, country, daysOpen, hourOpenStart, hourOpenEnd } = req.body;

        const existingRestaurant = await Restaurant.find({
            address: address,
            city: city,
            zipCode: zipCode,
            country: country,
            daysOpen: daysOpen,
            hourOpenStart: hourOpenStart,
            hourOpenEnd: hourOpenEnd
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
            daysOpen: daysOpen,
            hourOpenStart: hourOpenStart,
            hourOpenEnd: hourOpenEnd,
            lastUpdated: new Date()
        });
        await newRestaurant.save();

        return res.status(201).json(newRestaurant.toObject());

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error creating restaurant"});
    }
};

const getByID = async (req: Request, res: Response) => {
    try {
      const restaurantID = req.params.restaurantID;
  
      const restaurant = await Restaurant.findById(restaurantID);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      res.json(restaurant);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error getting restaurant" });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find().sort({ ["state"]: 1 })

        res.json(restaurants);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error getting all restaurants" });
    }
};
  
const search = async (req: Request, res: Response) => {
    try {
        const searchQuery = (req.query.searchQuery as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let queryParams: any = {};
        let response;
        let restaurants;
        let total;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, "i");
            queryParams["$or"] = [
                { city: searchRegex },
                { state: searchRegex },
                { zipCode: searchRegex }
            ];
            restaurants = await Restaurant.find(queryParams)
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

            total = await Restaurant.countDocuments(queryParams);
        } else {
            restaurants = await Restaurant.find()
            .sort({ [sortOption]: 1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

            total = await Restaurant.countDocuments();
        }

        response = {
            data: restaurants,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            },
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occured while searching restaurants" });
    }
};

export default {
    create,
    getByID,
    getAll,
    search
};
