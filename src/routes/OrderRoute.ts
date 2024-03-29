import express from "express";
import { validateJWT, parseJWT } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.post("/checkout/create",validateJWT,parseJWT,OrderController.createCheckoutSession);
router.post("/checkout/webhook",OrderController.stripeWebhookHandler);

export default router;