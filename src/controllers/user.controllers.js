import { Jwt } from "jsonwebtoken";
import { User } from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

const generateAccessAndRefreshToken = asyncHandler(async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong While Generating Tokens");
    }
});

const registerUser = asyncHandler(async (req, res) => {
    // Inputs from user frontend
    const {firstname, lastname, email,password,mobileNumber} = req.body;

    // Validating User Inputs
    if(([firstname,lastname,email,password,mobileNumber].some((field) => field?.trim() === ""))){
        throw new ApiError(400, "All fields are required");
    }

    // Checking Existing User
    const existedUser = await User.findOne({email});

    if(existedUser){
        throw new ApiError(409, "User Already Exist with email");
    }

    // Creating New User
    const user = await User.create(
        {
            firstname,
            lastname, 
            email,
            password,
            mobileNumber
        }
    );

    // Getting Data of Created User.
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something Went Wrong While registering User");
    }

    return res.status(200).ApiResponse(200, createdUser, "User Created Successfully");
})

const loginUser = asyncHandler(async (req, res) => {
    // Inputs from user frontend
    const {email, password} = req.body;

    // Validating User Email
    if(!email){
        throw new ApiError(400, "Email is required");
    }

    // Validating User Already Exist or Not
    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User Not Found");
    }
    // Check Password is Correct or Not
    const isPasswordCorrect = user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Password Incorrect");
    }

    // Generating Access and Refresh Token
    const {accessToken, refreshToken} = user.generateAccessAndRefreshToken();

    // Getting Logged In User Data
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly : true,
        secure : true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .ApiResponse(200, loggedInUser, "User Logged In Successfully");
});

const uploadAvatar = asyncHandler(async (req, res) => {
    let avatarLocalFilePath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalFilePath = req.files.avatar[0].path;
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);

    if(!avatar){
        throw new ApiError(500, "Something Went Wrong While Uploading Avatar");
    }

    const user = await User.findById(req.user._id);
    user.avatar = avatar.url;

    return res.status(200).ApiResponse(200, user, "Avatar Uploaded Successfully");
});


export {
    registerUser,
    loginUser,
}