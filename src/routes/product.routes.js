import { Router } from "express";
import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/product", auth, getAllProduct);
router.get("/product/:id", auth, getProductById);
router.post("/product", auth, admin, upload.single('image'), createProduct);
router.put("/product/:id", auth, admin, upload.single('image'), updateProduct);
router.delete("/product/:id", auth, admin, deleteProduct);

export default router;