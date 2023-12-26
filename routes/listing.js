import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js"
import { listingSchema } from "../schema.js"
import { ExpressError } from "../utils/ExpressError.js"
import { Listing } from "../models/listings.js"

const router = express.Router()

const validateListing = (req, res, next) =>{  //server side validation (like handling postman req)
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    }else{
        next()
    }
}

//Index Route
router.get("/", wrapAsync(async(req, res, next)=>{
    let allListings = await Listing.find()
    res.render("listings/index.ejs", {allListings})
})
)

//New and Create Route         //IMP: keep "listings/new"   route above   "listings/:id" so that new will not be treated as id"
router.get("/new", (req, res)=>{
    res.render("listings/new.ejs")
})

router.post("/", validateListing, wrapAsync(async(req, res, next)=>{
    let listing = new Listing(req.body.listing)
    await listing.save()
    res.redirect("/listings")
})
)

//Show Route
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", {listing})
})
)

//Edit and Update route
router.get("/:id/edit", wrapAsync(async(req, res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", {listing})
})
)

router.put("/:id", validateListing, wrapAsync(async(req, res)=>{
    let {id} = req.params
    let formListing = req.body.listing
    await Listing.findByIdAndUpdate(id, formListing, {runValidators: true})
    res.redirect(`/listings/${id}`)
})
)

//Delete Route
router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})
)

export const listings = router