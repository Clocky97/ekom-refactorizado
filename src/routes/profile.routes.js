import { Router } from "express";
import {
  getAllProfiles,
  getProfileById,
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";
import { createProfileValidation, updateProfileValidation } from "../middlewares/validations/profile.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { getUserAvRating } from "../controllers/rating.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/profile",  getAllProfiles);
router.get("/profile/:id",  getProfileById);
// Obtener perfil por user id
router.get("/profile/user/:userId", auth, getProfileByUserId);
// Allow uploading an avatar image with the field name 'avatar'
router.post("/profile", auth, upload.single('avatar'), createProfileValidation, handleValidation, createProfile);
// Route for updating profile data (JSON)
router.put("/profile/:id", auth, updateProfileValidation, handleValidation, updateProfile);

// Route for updating profile avatar (multipart/form-data)
router.put("/profile/:id/avatar", auth, upload.single('avatar'), updateProfile);

router.delete("/profile/:id", auth, admin, deleteProfile);
router.get("/profile/:userId/average-rating", getUserAvRating);

export default router;
