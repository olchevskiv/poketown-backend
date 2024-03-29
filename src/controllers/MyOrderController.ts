import { Request, Response } from "express";
import Order from "../models/order";

const getByID = async (req: Request, res: Response) => {
  try {
    const orderID = req.params.orderID;
    
    const orders = await Order.findOne({ user: req.userId, _id: orderID })
      .populate("restaurant");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occured getting order" });
  }
};

const getAll = async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({ user: req.userId })
        .populate("restaurant");
  
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error occured getting orders" });
    }
};

  export default {
    getByID,
    getAll
};