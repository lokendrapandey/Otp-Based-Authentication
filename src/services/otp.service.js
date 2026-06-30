import otpModel from "../models/otp.model.js";
import { sendEmail } from "./email.service.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import { hash } from "../utils/hash.js";

/**
 * Generate OTP, save hashed OTP in database
 * and send OTP to user's email.
 */
export const sendOtp = async (user) => {
    // Generate OTP
    const otp = generateOtp();

    // Hash OTP
    const otpHash = hash(otp);

    // Save OTP
    await otpModel.create({
        user: user._id,
        email: user.email,
        otpHash
    });

    // Generate Email HTML
    const html = getOtpHtml(otp);

    // Send Email
    await sendEmail(
        user.email,
        "Email Verification",
        `Your OTP is ${otp}`,
        html
    );

    return true;
};