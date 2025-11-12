import { Router } from "express";
import { admin, auth } from "../middlewares/auth.middleware.js";
import { createOffer, deleteOffer, getAllOffers, getOfferById, updateOffer } from "../controllers/offer.controller.js";

export const offerRoutes = Router();

// GET routes are public (no auth required)
offerRoutes.get("/offer", getAllOffers);
offerRoutes.get("/offer/:id", getOfferById);

// Protect POST, PUT, DELETE routes with auth + admin
offerRoutes.use(auth);
offerRoutes.post("/offer", admin, createOffer);
offerRoutes.put("/offer/:id", admin, updateOffer);
offerRoutes.delete("/offer/:id", admin, deleteOffer);