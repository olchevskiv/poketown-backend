/* 
    Validation logic for all requests using Express Validator 
    Middleware validation for all routes
*/

import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/* Helper to pass along and check validation rules to request */
const handleValidationErrors = async(req: Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array});
    }
    next();
}

// MyUserRoute - update
export const validateMyUserUpdateRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string."),
    body("addressLine").isString().notEmpty().withMessage('Address Line must be a string.'),
    body("city").isString().notEmpty().withMessage("City must be a string."),
    body("zipCode").isString().notEmpty().withMessage("Zip Code must be a string."),
    body("country").isString().notEmpty().withMessage("Country must be a string."),
    handleValidationErrors
];

// IngredientRoute - create
export const validateIngredientRequest = [
    body("name").notEmpty().withMessage("Ingredient name is required"),
    body("category").notEmpty().withMessage("Category (BASE,MIXIN,PROTEIN,TOPPING, or SAUCE) is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price be a positive number"),
    body("calories").isInt({ min: 0 }).withMessage("Calories must be a positive whole number"),
    handleValidationErrors,
  ];