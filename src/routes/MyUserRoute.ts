import express from "express";
import MyUserController from "../controllers/MyUserController";
import { validateJWT, parseJWT } from "../middleware/auth";
import { validateMyUserUpdateRequest } from "../middleware/validation";

const router = express.Router();

router.post("/", validateJWT, MyUserController.create);
router.put("/", validateJWT, parseJWT, validateMyUserUpdateRequest, MyUserController.update);
router.get("/", validateJWT, parseJWT, MyUserController.get);

export default router;