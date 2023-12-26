import mongoose from "mongoose";
import { sampleListings } from "./data.js";
import { Listing } from "../models/listings.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(MONGO_URL)
}
main().then((data)=>{
    console.log("Connected to DB")
}).catch((err)=>console.log(err))

const initDB = async()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(sampleListings)
}

initDB().then(()=>{
    console.log("Database initialized")
}).catch((err)=>console.log(err))
