import { body } from "express-validator";

export const createProfileValidation = [
  body("name")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("lastname")
    .notEmpty().withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("El apellido debe tener entre 2 y 100 caracteres"),
  body("bio")
    .optional()
    .isLength({ max: 500 }).withMessage("La bio no puede superar los 500 caracteres"),
  body("avatar")
    .optional()
    .isURL().withMessage("El avatar debe ser una URL válida"),
  body("user_id")
    .notEmpty().withMessage("El user_id es obligatorio")
    .isInt().withMessage("El user_id debe ser un número entero"),
];

export const updateProfileValidation = [
  body("name")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("lastname")
    .notEmpty().withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("El apellido debe tener entre 2 y 100 caracteres"),
  body("bio")
    .optional()
    .isLength({ max: 500 }).withMessage("La bio no puede superar los 500 caracteres"),
  body("avatar")
    .optional()
    .isURL().withMessage("El avatar debe ser una URL válida"),
];
