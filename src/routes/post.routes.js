import { Router } from "express";
import { getAllPost, getPostById, createPost, updatePost, deletePost } from "../controllers/post.controller.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { getPostAvRating } from "../controllers/rating.controller.js";

const router = Router();

router.get("/post", auth, getAllPost);
router.get("/post/loggued-user", auth, getPostById);
// Allow any authenticated user to create a post (admin not required)
router.post("/post", auth, createPost);
router.put("/post/:id", auth, admin, updatePost);
router.delete("/post/:id", auth, admin, deletePost);
router.get("/post/:postId/average-rating", getPostAvRating);

export default router;