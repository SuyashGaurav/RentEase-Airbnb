import { Listing } from "./models/listings.js"
import { Review } from "./models/review.js"
import { listingSchema } from "./schema.js"
import { ExpressError } from "./utils/ExpressError.js"
import { reviewSchema } from "./schema.js"

export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirectURL save info of user(what user want to do previously)
        req.session.redirectUrl = req.originalUrl
        if (req.originalUrl.includes("/reviews")){  //if user(logged out) tries to add review
            req.session.redirectUrl = req.originalUrl.replace("/reviews", "")  //redirect to show page
        }
        // console.log(req.originalUrl, req.session.redirectUrl)
        req.flash("error", "Please login first")
        return res.redirect("/login")
    }
    next()
}

//middleware to save redirectUrl as session will be reset if a user logged in
export const saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

//check owner if wanted to edit, delete a listing (server side authorization)
export const isOwner = async(req, res, next) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Oops! You don't have access to this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

//check owner if wanted to edit, delete a listing (server side authorization)
export const isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Oops! You don't have access to this review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

export const validateListing = (req, res, next) =>{  //server side validation (like handling postman req)
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}

export const validateReview = (req, res, next) =>{  //server side validation (like handling postman req)
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}
