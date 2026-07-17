import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, "Please enter product name"],
    },

    price: {
    type: Number,
    required: [true, "Please enter product price"],
    },

    MRP:{
    type:Number,
    required: [true, "please enter product MRP"]
    },

    description: {
    type: String,
    required: [true, "Please enter product description"],
    },

    ratings: {
    type: Number,
    default: 0,
    },

    images: [
    {
        public_id: {
        type: String,
        required: true,
        },
        url: {
        type: String,
        required: true,
        },
    },
    ],

    category: {
    type: String,
    required: [true, "Please enter product category"],
    },

    stock: {
    type: Number,
    required: [true, "Please enter product stock"],  
    default: 1,
    },

    numOfReviews: {
    type: Number,
    default: 0,
    },

    reviews: [
    {
        user:{ type: mongoose.Schema.ObjectId, ref: "User", required: true },
        name: {
        type: String,
        required: true,
        },
        avatar:{
        type: String,
        },
        rating: {
        type: Number,
        required: true,
        },
        comment: {
        type: String,
        required: true,
        },
        createdAt: {
        type: Date,
        default: Date.now,
        },
    },
    ],
    user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    },

    createdAt: {
    type: Date,
    default: Date.now,
    },
});

export default mongoose.model("Product", productSchema);    

