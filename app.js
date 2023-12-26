import express from "express"
import mongoose from "mongoose"
import { ExpressError } from "./utils/ExpressError.js"
import ejsMate from "ejs-mate"
import path from "path"
import { fileURLToPath } from "url"
import methodOverride from "method-override"

import {listings} from "./routes/listing.js"
import {reviews} from "./routes/review.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
let port = 8080

app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(MONGO_URL)
}
main().then((data)=>{
    console.log("Connected to DB")
}).catch((err)=>console.log(err))

app.get("/", (req, res)=>{
    res.send("Working root")
})

//Listing
app.use("/listings", listings)

//Review 
app.use("/listings/:id/reviews", reviews)

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next)=>{
    let {status=500, message="Some error occured!"} = err
    res.status(status).render("error.ejs", {message})
})

app.listen(port, ()=>{
    console.log("Listening at port 8080")
})