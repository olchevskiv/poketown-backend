import Stripe from "stripe";
import { Request, Response } from "express";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;


// Recieve events from Stripe checkout
const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event;
    try {
        // validate webhook comes from stripe
        const sig = req.headers["stripe-signature"];
        event = STRIPE.webhooks.constructEvent(
            JSON.stringify(req.body),
            sig as string,
            STRIPE_ENDPOINT_SECRET
        );

      } catch (error: any) {
        console.log(error);
        return res.status(400).send(`Webhook error occurred: ${error.message}`);
      }
    
      // If order was paid for, update order status and totalamount paid
      if (event.type === "checkout.session.completed") {
        const order = await Order.findById(event.data.object.metadata?.orderId);
    
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
    
        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";
    
        await order.save();
      }
    
      res.status(200).send();

}

export default {
    stripeWebhookHandler
};