import User from "../models/user.model.js";
import Profile from "../models/profile.model.js"; // para incluir el perfil

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Profile, as: "profile" }]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error obteniendo los usuarios: " + error.message });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: [{ model: Profile, as: "profile" }]
        });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al traer usuario: " + error.message });
    }
};

// Crear un usuario
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                error: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({ error: "Error al crear el usuario: " + error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await user.update(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario: " + error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await user.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar: " + error.message });
    }
};

// Obtener el usuario actualmente autenticado (con perfil)
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: [{ model: Profile, as: 'profile' }]
        });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario actual: ' + error.message });
    }
};
