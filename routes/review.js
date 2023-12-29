import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js"
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js"
import { reviewController } from "../controllers/review.js"

const router = express.Router({ mergeParams: true })

//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

export const reviewRouter = router