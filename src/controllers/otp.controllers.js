import mongoose from "mongoose";
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendOtp = asyncHandler(async (req, res) => {
    
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
        return res.status(400).json(new ApiError(400,"Failed To deliver" ));
    }
});

const verifyOtp = asyncHandler (async (req, res) => {
    const {countryCode,phoneNumber, otp} = req.body;
    try {
        const verify = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+${countryCode}${phoneNumber}`,
                code: otp,
            });

        console.log(verify);
        if(verify.status !== "approved"){
            throw new ApiError(400,"Wrong OTP");
        }
        return res
        .status(200)
        .json(new ApiResponse(200, "OTP Verified Successfully", verify)); 

    } catch (error) {
        return res.status(400).json(new ApiError(400, "Wrong OTP"));
    }
    
});

export {
    sendOtp,
    verifyOtp
}