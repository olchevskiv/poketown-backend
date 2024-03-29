import express from "express";
import IngredientController from "../../controllers/IngredientController";
import { validateJWT, parseJWT } from "../../middleware/auth";
import multer from "multer";
import { validateIngredientRequest } from "../../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits : {
        fileSize:  parseInt(process.env.FILE_SIZE_LIMIT_MB as string, 10) * 1024 * 1025 
    }
});


router.post("/",validateJWT,parseJWT,upload.single("imageFile"), validateIngredientRequest, IngredientController.create);
router.get("/", IngredientController.getIngredients);

export default router;