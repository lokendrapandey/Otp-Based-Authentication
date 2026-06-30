import jwt from "jsonwebtoken";
import config from "../config/config.js";


/**
 * Generate Access Token
 */
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "15m"
    });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "7d"
    });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};