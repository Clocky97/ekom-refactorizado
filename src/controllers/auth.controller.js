
import { json, Sequelize } from "sequelize";
import User from "../models/user.model.js";
import { sequelize } from "../config/database.js";
import Profile from "../models/profile.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

import { validationResult } from "express-validator";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "secretito";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secreto";

// Registro
export const register = async (req, res) => {
  // Validar errores de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }

  const t = await sequelize.transaction();
  try {
    const { username, email, password, role, name, lastname } = req.body;

    const hashed = await hashPassword(password);
    // Crea el usuario
    const user = await User.create({ username, email, password: hashed, role, name, lastname }, { transaction: t });
    // Crea el perfil con nombre y apellido, los demás campos en blanco
    await Profile.create({
      name: name,
      lastname: lastname,
      user_id: user.id,
      // Otros campos en blanco o null
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    await t.rollback();
    // Mostrar error de Sequelize si es de validación
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Buscar usuario por email
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        // Generar token con la información del usuario
        const tokenData = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            role: user.role
        };
        
        const token = generateToken(tokenData);

        // Enviar respuesta con token y datos del usuario
        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

export const logout = async(req,res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            msg: "Logout exitoso"
        })
    } catch (error) {
         res.status(500).json({error})
    }
};

