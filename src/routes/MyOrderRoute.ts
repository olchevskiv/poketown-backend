import express from "express";
import { validateJWT, parseJWT } from "../middleware/auth";
import MyOrderController from "../controllers/MyOrderController";
import { param } from "express-validator";

const router = express.Router();

router.get("/", validateJWT, parseJWT, MyOrderController.getAll);
router.get("/active", validateJWT, parseJWT, MyOrderController.getActive);
router.get("/:orderID", validateJWT, parseJWT, param("orderID").isString().trim().notEmpty().withMessage("OrderID paramenter must be valid"), MyOrderController.getByID);


export default router;