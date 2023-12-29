import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    comment:{
        type: String,
        maxLength: 140
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Review = mongoose.model("Review", reviewSchema)