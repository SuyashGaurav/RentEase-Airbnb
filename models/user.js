import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose)
export const User = mongoose.model("User", userSchema)