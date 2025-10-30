import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/validations/user.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { updateUserValidation } from "../middlewares/validations/user.validation.js";
import { registerValidations } from "../middlewares/validations/auth.validations.js";


const router = Router();

// Rutas públicas de autenticación
router.post("/register", registerValidations, handleValidation, register);
router.post("/login", login);
router.post("/logout", auth, logout);  // El logout sí necesita autenticación

// Rutas protegidas que requieren autenticación
router.get("/user", auth, getAllUsers);
router.get("/user/:id", auth, getUserById);
router.post("/user", auth, admin, createUserValidation, handleValidation, createUser);
router.put("/user/:id", auth, updateUserValidation, handleValidation, updateUser);
router.delete("/user/:id", auth, admin, deleteUser);

export default router;

