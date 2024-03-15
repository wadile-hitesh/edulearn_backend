import mongoose from "mongoose";
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import twilio from 'twilio';

const sendOtp = asyncHandler(async (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const { countryCode, phoneNumber } = req.body;

    try {
        console.log("Sending OTP");
        const otpResponse = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({
                to: `+${countryCode}${phoneNumber}`,
                channel: "sms",
            })
        console.log(otpResponse);
        return res  
        .status(200)
        .json(new ApiResponse(200, 'OTP sent successfully', otpResponse));
    } catch (error) {
        return res.status(400).json(new ApiError(400, error));
    }
});

export {
    sendOtp
}