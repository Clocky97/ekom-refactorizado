import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { createUserValidation } from "../middlewares/validations/user.validation.js";
import { handleValidation } from "../middlewares/validation_handler.js";
import { auth, admin } from "../middlewares/auth.middleware.js";
import { updateUserValidation } from "../middlewares/validations/user.validation.js";
import { registerValidations } from "../middlewares/validations/auth.validations.js";


const router = Router();

router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user/", auth, admin, createUserValidation, handleValidation, createUser);
router.put("/user/:id", auth, updateUserValidation, handleValidation, updateUser);
//register,login y logout
router.post("/register", registerValidations, handleValidation, register);
router.post("/login", login);
router.post("/logout", logout);
//Solo el admin debe poder eliminar y ver todos los usuarios
router.delete("/user/:id", auth, admin, deleteUser);

// Rutas protegidas
router.get("/user", auth, getAllUsers);
router.get("/user/:id", auth, getUserById);
router.post("/user/", createUserValidation, handleValidation, createUser);
router.put("/user/:id", auth, createUserValidation, handleValidation, updateUser);
router.delete("/user/:id", auth, admin, deleteUser);

export default router;

