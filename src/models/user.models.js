import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "First Name is required"],
            lowercase: true,
        },
        lastname: {
            type: String,
            required: [true, "Last Name is required"],
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password : {
            type: String,
            required: [true, "Password is required"],
        },
        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
        },
        avatar: {
            type : "String",
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],
    },
    { timestamps: true }
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(this.password, password);
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            id : this._id,
            email : this.firstname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
