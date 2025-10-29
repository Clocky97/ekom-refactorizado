import { Router } from "express";
import { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { auth, admin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/category", auth, getAllCategory);
router.get("/category/:id", auth, getCategoryById);
router.post("/category", auth, admin, createCategory);
router.put("/category/:id", auth, admin, updateCategory);
router.delete("/category/:id", auth, admin, deleteCategory);

export default router;

