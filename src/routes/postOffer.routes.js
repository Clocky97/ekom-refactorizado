import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createPostOffer, getOffersByPost, getFeaturedOffers, updateOfferStatus, createSeedOffers, applyOwnerOffer, removeOwnerOffer } from "../controllers/postOffer.controller.js";

const router = Router();

// Public: get featured offers
router.get("/post-offers/featured", getFeaturedOffers);

// Public: get offers for a specific post
router.get("/posts/:postId/offers", getOffersByPost);

// Auth required to create an offer
router.post("/post-offers", auth, createPostOffer);

// Auth required to update an offer (accept/reject) - owner/admin check in controller
router.put("/post-offers/:id", auth, updateOfferStatus);

// Owner applies a discount offer to their post
router.put('/posts/:postId/apply-offer', auth, applyOwnerOffer);

// Owner removes the discount from their post
router.delete('/posts/:postId/remove-offer', auth, removeOwnerOffer);

// Dev-only: seed some offers for testing
router.post('/dev/seed-offers', createSeedOffers);

export default router;
