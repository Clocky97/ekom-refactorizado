import { Router } from "express";
import { admin, auth } from "../middlewares/auth.middleware.js";
import { createMarket, deleteMarket, getAllMarkets, updateMarket } from "../controllers/market.controller.js";

const marketRoutes = Router()

marketRoutes.use(auth);

marketRoutes.get("/markets", getAllMarkets);
marketRoutes.post("/markets", admin, createMarket);
marketRoutes.put("/markets/id", admin, updateMarket);
marketRoutes.delete("/markets/id", admin, deleteMarket);
