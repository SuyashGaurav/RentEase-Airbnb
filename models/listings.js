import mongoose from "mongoose"
import { Review } from "./review.js"

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        url: String,
        filename: String
    },
    price: {
        type: Number,
        min: 0
    },
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    }
})

//post middleware (if listing is deleted then delete all ratings associated)
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

export const Listing = mongoose.model("Listing", listingSchema)