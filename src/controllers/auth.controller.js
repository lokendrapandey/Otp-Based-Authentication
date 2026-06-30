import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";

import { hash } from "../utils/hash.js";
import { cookieOptions } from "../config/cookie.config.js";

import { sendOtp } from "../services/otp.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
} from "../services/token.service.js";

export const register = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne(
    { $or: [{ username }, { email }] },
    "_id"
    );

    if (isAlreadyRegistered)
        throw new ApiError(409, "Username or email already exists.");

    const user = await userModel.create({
        username,
        email,
        password: hash(password)
    });

    await sendOtp(user);

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully. Please verify your email.",
            {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        )
    );

});

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user)
        throw new ApiError(401, "Invalid email or password.");

    if (!user.verified)
        throw new ApiError(403, "Please verify your email first.");

    if (hash(password) !== user.password)
        throw new ApiError(401, "Invalid email or password.");

    const refreshToken = generateRefreshToken({ id: user._id });

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash: hash(refreshToken),
        ip: req.ip,
        userAgent: req.get("user-agent")
    });

    const accessToken = generateAccessToken({
        id: user._id,
        sessionId: session._id
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful.",
            {
                accessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    verified: user.verified
                }
            }
        )
    );

});


export const getMe = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully.",
            req.user
        )
    );

});

export const refreshToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
        throw new ApiError(401, "Refresh token not found.");

    const decoded = verifyToken(refreshToken);

    const session = await sessionModel.findOne({
        user: decoded.id,
        refreshTokenHash: hash(refreshToken),
        revoked: false
        });

    if (!session)
        throw new ApiError(401, "Invalid refresh token.");

    const accessToken = generateAccessToken({
        id: decoded.id,
        sessionId: session._id
    });

    const newRefreshToken = generateRefreshToken({
        id: decoded.id
    });

    session.refreshTokenHash = hash(newRefreshToken);

    await session.save();

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Access token refreshed successfully.",
            { accessToken }
        )
    );

});


export const logout = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
        throw new ApiError(401, "Refresh token not found.");

    const decoded = verifyToken(refreshToken);

    const session = await sessionModel.findOne({
        user: decoded.id,
        refreshTokenHash: hash(refreshToken),
        revoked: false
    });

    if (!session)
        throw new ApiError(401, "Invalid refresh token.");

    session.revoked = true;

    await session.save();

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logged out successfully."
        )
    );

});

export const logoutAll = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
        throw new ApiError(401, "Refresh token not found.");

    const decoded = verifyToken(refreshToken);

    await sessionModel.updateMany(
        {
            user: decoded.id,
            revoked: false
        },
        {
            revoked: true
        }
    );

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logged out from all devices successfully."
        )
    );

});

export const verifyEmail = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    const otpDoc = await otpModel.findOne({
        email,
        otpHash: hash(otp)
    });

    if (!otpDoc)
        throw new ApiError(400, "Invalid OTP.");

        const user = await userModel.findOneAndUpdate(
        {
            _id: otpDoc.user,
            verified: false
        },
        {
            verified: true
        },
        {
            new: true
        }
    ).select("-password");

    if (!user)
    throw new ApiError(400, "Email is already verified.");

    await otpModel.deleteMany({
        user: otpDoc.user
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Email verified successfully.",
            user
        )
    );

});



export const getAllUsers = asyncHandler(async (req, res) => {

    const users = await userModel.find().select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully.",
            {
                count: users.length,
                users
            }
        )
    );

});