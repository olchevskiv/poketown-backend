import express from "express";
import RestaurantController from "../controllers/RestaurantController";
import { validateJWT, parseJWT } from "../middleware/auth";
import { param } from "express-validator";

const router = express.Router();

router.post("/", validateJWT, RestaurantController.create);
router.get("/search",RestaurantController.search);
router.get("/:restaurantID",param("restaurantID").isString().trim().notEmpty().withMessage("RestaurantID must be valid"),RestaurantController.getByID);
router.get("/",RestaurantController.getAll);

export default router;