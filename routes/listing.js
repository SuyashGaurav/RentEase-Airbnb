import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js"
import { isLoggedIn, isOwner, validateListing } from "../middleware.js"
import { listingController } from "../controllers/listing.js"
import multer from "multer"
import { storage } from "../cloudConfig.js"
import { Listing } from "../models/listings.js"
const upload = multer({storage})

const router = express.Router()

router.route("/")        //Index Route
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))   //Create Route

//New and Create Route         //IMP: keep "listings/new"   route above   "listings/:id" so that new will not be treated as id"
router.get("/new", isLoggedIn, listingController.renderNewForm)

//Search route
router.get("/search", wrapAsync(listingController.searchListing))

router.route("/:id") 
    .get(wrapAsync(listingController.showListing))        //Show Route
    .put(isOwner, isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) //Update route
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing))  //Delete Route

//Edit and Update route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm))

export const listingRouter = router