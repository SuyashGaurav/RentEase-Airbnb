import {User} from "../models/user.js"

const renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs")
}

const signUp = async(req, res)=>{
    try{
        let{username, email, password} = req.body
        const newUser = new User({email, username})
        let registeredUser = await User.register(newUser, password)    //authenticate, register and save
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to WanderLust")
            res.redirect("/listings")
        })
    }catch(err){  //if account already exists
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}

const renderLoginForm = (req, res)=>{
    res.render("users/login.ejs")
}

const login = async(req, res)=>{
    req.flash("success", "Welcome back to WanderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

const logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings")
    })
}

export const userController = {signUp, renderSignupForm, renderLoginForm, login, logout}