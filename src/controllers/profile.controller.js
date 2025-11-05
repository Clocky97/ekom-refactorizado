import { Profile } from "../models/relations.index.js";
import { User } from "../models/relations.index.js";

// Obtener todos los perfiles
export const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            include: [{ model: User, as: "user" }]
        });
        // convert avatar paths to full URLs
        const host = `${req.protocol}://${req.get('host')}`;
        const normalized = profiles.map(p => {
            const obj = p.toJSON();
            if (obj.avatar && obj.avatar.startsWith('/uploads')) {
                obj.avatar = `${host}${obj.avatar}`;
            }
            return obj;
        });
        res.json(normalized);
    } catch (error) {
        res.status(500).json({ error: "Error al traer los perfiles: " + error.message });
    }
};

// Obtener un perfil por ID
export const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id, {
            include: [{ model: User, as: "user" }]
        });
        if (!profile) {
            return res.status(404).json({ error: "Perfil no encontrado" });
        }
        const obj = profile.toJSON();
        const host = `${req.protocol}://${req.get('host')}`;
        if (obj.avatar && obj.avatar.startsWith('/uploads')) {
            obj.avatar = `${host}${obj.avatar}`;
        }
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: "Error al traer el perfil: " + error.message });
    }
};

// Obtener perfil por user_id (útil cuando tenemos el id del usuario)
export const getProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({
            where: { user_id: userId },
            include: [{ model: User, as: "user" }]
        });
        if (!profile) {
            return res.status(404).json({ error: "Perfil no encontrado para este usuario" });
        }
        const obj = profile.toJSON();
        const host = `${req.protocol}://${req.get('host')}`;
        if (obj.avatar && obj.avatar.startsWith('/uploads')) {
            obj.avatar = `${host}${obj.avatar}`;
        }
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: "Error al traer el perfil por userId: " + error.message });
    }
};

// Crear un perfil
export const createProfile = async (req, res) => {
    try {
        // If an avatar file was uploaded via multer, set the avatar path
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        const profile = await Profile.create(req.body);
        const obj = profile.toJSON();
        const host = `${req.protocol}://${req.get('host')}`;
        if (obj.avatar && obj.avatar.startsWith('/uploads')) {
            obj.avatar = `${host}${obj.avatar}`;
        }
        res.status(201).json(obj);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ 
                error: error.errors.map(e => e.message) 
            });
        }
        res.status(500).json({ error: "Error al crear el perfil: " + error.message });
    }
};

// Actualizar un perfil
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "Perfil no econtrado" });
        }
        console.log('updateProfile - req.user:', req.user && req.user.id);
        console.log('updateProfile - req.body:', req.body);
        // If an avatar file was uploaded, set the avatar path so it gets saved
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        await profile.update(req.body);
        const updated = await Profile.findByPk(id);
        const obj = updated.toJSON();
        const host = `${req.protocol}://${req.get('host')}`;
        if (obj.avatar && obj.avatar.startsWith('/uploads')) {
            obj.avatar = `${host}${obj.avatar}`;
        }
        res.json(obj);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
    }
};

// Eliminar un perfil
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findByPk(id);
        if (!profile) {
            return res.status(404).json({ error: "Perfil no encontrado" });
        }
        await profile.destroy();
        res.json({ message: "perfil eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar: " + error.message });
    }
};
