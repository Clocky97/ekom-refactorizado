import { Router } from "express";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";
import { createProfileValidation } from "../middlewares/validations/profile.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { getUserAvRating } from "../controllers/rating.controller.js";

const router = Router();

router.get("/profile",  getAllProfiles);
router.get("/profile/:id",  getProfileById);
router.post("/profile", auth, createProfileValidation, handleValidation, createProfile);
router.put("/profile/:id", auth, createProfileValidation, handleValidation, updateProfile);
router.delete("/profile/:id", auth, admin, deleteProfile);
router.get("/profile/:userId/average-rating", getUserAvRating);

export default router;
