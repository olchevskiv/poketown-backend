import express from "express";
import RestaurantController from "../controllers/RestaurantController";
import { validateJWT, parseJWT } from "../middleware/auth";

const router = express.Router();

router.post("/", validateJWT,  RestaurantController.create);

export default router;