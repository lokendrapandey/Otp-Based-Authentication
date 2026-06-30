import { body } from "express-validator";

// Register Validator
export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can contain only letters, numbers and underscore"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/)
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character"
        )
];

// Login Validator
export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
];

// Verify Email Validator
export const verifyEmailValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email")
        .normalizeEmail(),

    body("otp")
        .trim()
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
        .isNumeric().withMessage("OTP must contain only numbers")
];