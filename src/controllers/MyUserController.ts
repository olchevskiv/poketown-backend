import { Request, Response } from "express";
import User from "../models/user";

const create = async (req: Request, res: Response) => {
    try {

        // Get Auth0 id from request
        const { auth0Id } = req.body;

        // Check if user exists already
        const existingUser = await User.findOne({ auth0Id });
        if (existingUser) {
            return res.status(200).send();
        }

        // Create user if they dont exist
        const newUser = new User(req.body);
        await newUser.save();

        return res.status(201).json(newUser.toObject());

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error creating user"});
    }
};

const update = async (req: Request, res: Response) => {
    try {
        // Get Auth0 id from request
        const { name, addressLine, zipCode, city, country } = req.body;

        // Check if user exists already
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.name = name;
        user.addressLine = addressLine;
        user.city = city;
        user.zipCode = zipCode;
        user.country = country;

        await user.save();

        res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error updating user"});
    }
};

const get = async (req: Request, res: Response) => {
    try {
        const myUser = await User.findOne({_id: req.userId});

        if (!myUser) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(myUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error getting user"});
    }
};

export default {
    create,
    update,
    get
};
