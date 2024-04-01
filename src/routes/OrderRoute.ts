import express from "express";
import { validateJWT, parseJWT } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.post("/checkout/create",validateJWT,parseJWT,OrderController.createCheckoutSession);

export default router;