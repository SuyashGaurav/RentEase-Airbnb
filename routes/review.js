import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js"
import { reviewSchema } from "../schema.js"
import { ExpressError } from "../utils/ExpressError.js"
import { Review } from "../models/review.js"
import { Listing } from "../models/listings.js"

const router = express.Router({ mergeParams: true })

const validateReview = (req, res, next) =>{  //server side validation (like handling postman req)
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}

//create route
router.post("/", validateReview, wrapAsync(async(req, res)=>{
    let {id} = req.params               // id?? coming from mergeParams in Router
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${id}`)
}))

//Delete review route
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
}))

export const reviews = router