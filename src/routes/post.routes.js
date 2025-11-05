import { Router } from "express";
import { getAllPost, getPostById, createPost, updatePost, deletePost } from "../controllers/post.controller.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { getPostAvRating } from "../controllers/rating.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/post", auth, getAllPost);
router.get("/post/loggued-user", auth, getPostById);
// Allow any authenticated user to create a post (admin not required). Expect 'image' file field.
router.post("/post", auth, upload.single('image'), createPost);
// Allow update and delete by owner OR admin. Delete now handled in controller authorization.
router.put("/post/:id", auth, updatePost);
router.delete("/post/:id", auth, deletePost);
router.get("/post/:postId/average-rating", getPostAvRating);

export default router;