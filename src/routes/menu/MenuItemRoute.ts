import express from "express";
import MenuItemController from "../../controllers/MenuItemController";
import { validateJWT, parseJWT } from "../../middleware/auth";
import multer from "multer";
import { param } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits : {
        fileSize:  parseInt(process.env.FILE_SIZE_LIMIT_MB as string, 10) * 1024 * 1025 
    }
});


router.post("/", upload.single("imageFile"), MenuItemController.create);
router.get("/", MenuItemController.getMenuItems);
router.get("/:menuItemID", param("menuItemID").isString().trim().notEmpty().withMessage("MenuItemID paramenter must be valid"), MenuItemController.get);

export default router;