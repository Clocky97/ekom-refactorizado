import { body, param } from "express-validator";

export const createProductValidations = [
    body("product_name").trim()
    .isString()
    .notEmpty().withMessage("El nombre del producto es obligatorio")
    .isLength({min:3, max: 50})
    ,
    body("price").isDecimal()
    .notEmpty().withMessage("El precio es obligatorio")
    ,
    body("brand").trim()
    .isString().withMessage("La marca es un campo obligatorio")
    .notEmpty()
    ,
    body("image").isURL()
]; 

export const getProductValidations = [
    
];