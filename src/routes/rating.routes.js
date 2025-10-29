import { Router } from "express";
import { ratePost, getPostAverageRating } from "../controllers/rating.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/rating", auth, ratePost);
router.get("/rating/:postId", getPostAverageRating);

export default router;