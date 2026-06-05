import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
{
    name: {
    type: String,
    required: [true, "Please enter your name"],
    },      

    email: {
    type: String,
    required: [true, "Please enter your email"],    
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
    },

    password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password should be at least 8 characters"],
    Select: false,

    },      

    avatar: {
    public_id: {
        type: String,
        required: true,
    },
    url: {  
        type: String,
        required: true,
    },
    },  
     

    role: {
    type: String,
    default: "user",
    }, 
    resetpasswordtoken: String,
    resetpasswordexpire: Date, 

    createdAt: {
    type: Date,
    default: Date.now,
    },
},
    {timestamps: true}
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare password == is password matched or not
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetpasswordtoken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordexpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
};


export default mongoose.model("User", userSchema);