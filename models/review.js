import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    comment:{
        type: String,
        maxLength: 50
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
    }
})

export const Review = mongoose.model("Review", reviewSchema)