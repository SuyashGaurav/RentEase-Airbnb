import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js"
import passport from "passport"
import { saveRedirectUrl } from "../middleware.js"
import { userController } from "../controllers/user.js"

const router = express.Router()

//Signup
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUp))

//Login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", 
                            {failureRedirect: "/login", failureFlash: true}
                            ), wrapAsync(userController.login))

//LogOut
router.get("/logout", userController.logout)

export const userRouter = router