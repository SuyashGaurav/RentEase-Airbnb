import dotenv from 'dotenv';
dotenv.config()
import {Listing} from "../models/listings.js"
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding-v6.js'
const mapToken = process.env.MAP_TOKEN
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const index = async(req, res, next)=>{
    let allListings = await Listing.find()
    res.render("listings/index.ejs", {allListings})
}

const renderNewForm = (req, res)=>{
    // console.log(req.user)
    res.render("listings/new.ejs")
}

const showListing = async(req, res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner")
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    // console.log(req.user._id, listing.owner._id)
    let response = await geoCodingClient.forwardGeocode({
        query: listing.location + " " +  listing.country,
        limit: 1
    }).send()
    let coordinates = response.body.features[0].properties.coordinates
    res.render("listings/show.ejs", {listing, coordinates})
}

const searchListing = async(req, res)=>{
    let { searchItem } = req.query
    let searchListing = await Listing.find({
        $or : [
            {title: {$regex: searchItem, $options: 'i'}},
            {location: {$regex: searchItem, $options: 'i'}},
            {country: {$regex: searchItem, $options: 'i'}},
            {description: {$regex: searchItem, $options: 'i'}}
        ]
    })
    res.render("listings/search.ejs", {searchItem, searchListing})
}

const createListing = async(req, res, next)=>{
    let url = req.file.path
    let filename = req.file.filename
    let listing = new Listing(req.body.listing)
    listing.owner = req.user._id  //for owner
    listing.image = {url, filename}
    await listing.save()
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}

const renderEditForm = async(req, res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {listing})
}

const updateListing = async(req, res)=>{
    let {id} = req.params
    let formListing = req.body.listing
    let listing = await Listing.findByIdAndUpdate(id, formListing, {runValidators: true})

    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }
    
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

const destroyListing = async(req, res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}

export const listingController = {index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing, searchListing}