import { Review } from "../models/review.js"
import { Listing } from "../models/listings.js"

const createReview = async(req, res)=>{
    let {id} = req.params               // id?? coming from mergeParams in Router
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    // console.log(req.user.username)
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success", "Review created!")
    res.redirect(`/listings/${id}`)
}

const destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`)
}

export const reviewController = {createReview, destroyReview}