import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        lowercase: true,
    },
    instructor: {
        type: String,
        required: [true, "Instructor is required"],
        lowercase: true,
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
        lowercase: true,
    },
    price: {
        type: String,
        required: [true, "Price is required"],
        lowercase: true,
    },
    rating: {
        type: String,
        required: [true, "Rating is required"],
        lowercase: true,
    },
    students: [],
    reviews: [],
    image: {
        type: String,
        required: [true, "Image is required"],
        lowercase: true,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        lowercase: true,
    },
    subCategory: {
        type: String,
        required: [true, "SubCategory is required"],
        lowercase: true,
    },
    tags: [],
    status: {
        type: String,
        required: [true, "Status is required"],
        lowercase: true,
    },
    isPublished: {
        type: String,
        required: [true, "isPublished is required"],
        lowercase: true,
    },
    isApproved: {
        type: String,
        required: [true, "isApproved is required"],
        lowercase: true,
    },
    isDeleted: {
        type: String,
        required: [true, "isDeleted is required"],
        lowercase: true,
    },
    createdBy: {
        type: String,
        required: [true, "createdBy is required"],
        lowercase: true,
    },
    updatedBy: {
        type: String,
        required: [true, "updatedBy is required"],
        lowercase: true,
    },
    deletedBy: {
        type: String,
        required: [true, "deletedBy is required"],
        lowercase: true,
    },
    deletedAt: {
        type: String,
        required: [true, "deletedAt is required"],
        lowercase: true,
    }
},{timestamps: true});

export const Course = mongoose.model("Course", courseSchema);