import { Router } from "express";
import { admin, auth } from "../middlewares/auth.middleware.js";
import { createMarket, deleteMarket, getAllMarkets, updateMarket } from "../controllers/market.controller.js";

const router = Router();

// Rutas de markets
router.get("/markets", auth, getAllMarkets);
router.post("/markets", auth, admin, createMarket);
router.put("/markets/:id", auth, admin, updateMarket);
router.delete("/markets/:id", auth, admin, deleteMarket);

export default router;
