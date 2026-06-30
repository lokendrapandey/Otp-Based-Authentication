import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "./asyncHandler.js";
import { verifyToken } from "../services/token.service.js";

const authMiddleware = asyncHandler(async (req, res, next) => {

    // Get Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization token is required.");
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = verifyToken(token);

    // Check User
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    // Check Session
    if (decoded.sessionId) {
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            revoked: false
        });

        if (!session) {
            throw new ApiError(401, "Session expired. Please login again.");
        }
    }

    // Attach User
    req.user = user;
    req.sessionId = decoded.sessionId;

    next();

});

export default authMiddleware;