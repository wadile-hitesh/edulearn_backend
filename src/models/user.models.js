import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastname : {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true
    },
},{timestamps:true});

export const User = mongoose.model("User", userSchema);