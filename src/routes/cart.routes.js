import { Router } from "express";
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Get user's cart
router.get("/cart", auth, getUserCart);

// Add item to cart
router.post("/cart", auth, addToCart);

// Update item quantity in cart
router.put("/cart/:post_id", auth, updateCartItem);

// Remove item from cart
router.delete("/cart/:post_id", auth, removeFromCart);

// Clear entire cart
router.delete("/cart", auth, clearCart);

export default router;
