import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
import express from "express"
import mongoose from "mongoose"
import { ExpressError } from "./utils/ExpressError.js"
import ejsMate from "ejs-mate"
import path from "path"
import { fileURLToPath } from "url"
import methodOverride from "method-override"
import session from "express-session"
import MongoStore from "connect-mongo"
import flash from "connect-flash"
import passport from "passport"
import LocalStrategy from "passport-local"
import {User} from "./models/user.js"

import {listingRouter} from "./routes/listing.js"
import {reviewRouter} from "./routes/review.js"
import {userRouter} from "./routes/user.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
let port = 8080

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
})

store.on("error", ()=>{
    console.log("ERROR in Mongo Session Store", err)
})

app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, //1 week in millisec
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

async function main(){
    await mongoose.connect(dbUrl)
}
main().then((data)=>{
    console.log("Connected to DB")
}).catch((err)=>console.log(err))

// app.get("/", (req, res)=>{
//     res.send("Working root")
// })

app.use((req, res, next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next()
})

//Listing
app.use("/listings", listingRouter)

//Review 
app.use("/listings/:id/reviews", reviewRouter)

//User
app.use("/", userRouter)

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