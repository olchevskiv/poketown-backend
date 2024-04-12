import Stripe from "stripe";
import { Request, Response } from "express";
import Order from "../models/order";
import MenuItem from "../models/menuItem";

import { MenuItemType } from "../models/menuItem";
import Ingredient, { IngredientType } from "../models/ingredient";
import Restaurant from "../models/restaurant";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;


type CartItem = {
    menuItemId: string,
    isCustom: boolean,
    name: string,
    price: number,
    quantity: number,
    calories: number,
    image_url: string,
    ingredients: IngredientType[]
}

type CheckoutSessionRequest = {
    pickUpTime: Date,
    cartItems: CartItem[],
    restaurantId: string,

}

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const CheckoutSessionRequest: CheckoutSessionRequest = req.body;

        let ingredients : IngredientType[];
        let menuItems: MenuItemType[];
        let restaurantId = CheckoutSessionRequest.restaurantId;


        MenuItem.find().then((data) => {
            menuItems = data;
            if (!menuItems) {
                throw new Error('Menu items not found');
            }

            Ingredient.find().then( (data) => {
                ingredients = data;
                if (!ingredients) {
                    throw new Error('Ingredients not found');
                }

                const newOrder = new Order({
                    restaurant: restaurantId,
                    user: req.userId,
                    status: "placed",
                    pickUpTime: CheckoutSessionRequest.pickUpTime,
                    cartItems: CheckoutSessionRequest.cartItems,
                    createdAt: new Date()
                    
                })

                const stripeLineItems = createStripeLineItems(CheckoutSessionRequest, menuItems, ingredients);

                createStripeSession(
                    stripeLineItems, 
                    newOrder._id.toString(), 
                    restaurantId
                ).then((stripeSession) => {

                        if (!stripeSession.url) {
                            return res.status(500).json({message: "Error creating Stripe session"})
                        }

                        newOrder.save(); // save new order record to database, after session was successfully started

                        res.json({ url: stripeSession.url });
                    }
                );
            });
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.raw.message });
    }
};

/* -----  Stripe Checkout helper functions ---- */
const createStripeLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: MenuItemType[], ingredients: IngredientType[]) => {

    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        let lineItemPrice; // in cents

        // Calculate price of each cart item
        if (cartItem.isCustom) {  // Custom cart item prices are calculated based on base price + cost of each ingredient
            const customBasePrice = 9.5;
            const ingredientTotalPrice = cartItem.ingredients.reduce(
                (totalPrice, cartIngredient)=>{
                    let ingredient = ingredients.find(
                        (ingredient) => ingredient._id.toString() === cartIngredient._id.toString()
                    )
                    if (ingredient) {
                        return totalPrice + ingredient.price;
                    } else {
                        return totalPrice;
                    }
                },
                customBasePrice
            );
            lineItemPrice = ingredientTotalPrice * 100; // convert to cents
        } else { // regular menu items use stored price from database
            let menuItem = menuItems.find(
                (item) => item._id.toString() === cartItem.menuItemId.toString()
            );

            if(!menuItem){
                throw new Error(`Menu item not found: ${cartItem.menuItemId}`)
            }

            lineItemPrice = menuItem.price * 100; // convert to cents
        }

        // Create line item  per cart item
        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data:{
                currency: "usd",
                unit_amount : lineItemPrice,
                tax_behavior: "exclusive",
                product_data: {
                    name: cartItem.name,
                    tax_code: 'txcd_40060003'
                },
            },
            quantity: cartItem.quantity
        }
       
        return line_item;
    });

    return lineItems;

}

const createStripeSession = (stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, restaurantId: string) => {

    const sessionData = STRIPE.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: "payment",
        metadata: {
            orderId,
            restaurantId
        },
        automatic_tax: {
            enabled: true
        },
        success_url: `${FRONTEND_URL}/order/${orderId}?success=true`,
        cancel_url: `${FRONTEND_URL}/checkout?canceled=true`,
    });

    return sessionData;
}


export default {
    createCheckoutSession
};