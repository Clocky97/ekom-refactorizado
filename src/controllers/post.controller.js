import { PostModel } from "../models/post.model.js";
import { User, Profile } from "../models/relations.index.js";
import DeletionLog from "../models/deletion.model.js";

export const getAllPost = async (req, res) => {
    try {
        // Include the post owner (user) and their profile so frontend can display owner names
        const posts = await PostModel.findAll({
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['id', 'username', 'email'],
                    include: [
                        { model: Profile, as: 'profile', attributes: ['name', 'lastname'] }
                    ]
                }
            ]
        });

        // Normalize response shape so frontend can read `post.user` and `post.user_name`
        const normalized = posts.map(p => {
            const obj = p.toJSON();
            obj.user = obj.usuario || null;
            // prefer full name from profile when available
            if (obj.user && obj.user.profile && (obj.user.profile.name || obj.user.profile.lastname)) {
                obj.user_name = `${obj.user.profile.name || ''}${obj.user.profile.lastname ? ' ' + obj.user.profile.lastname : ''}`.trim();
            } else if (obj.user && obj.user.username) {
                obj.user_name = obj.user.username;
            } else {
                obj.user_name = null;
            }
            return obj;
        });

        res.status(200).json(normalized);
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await PostModel.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['id', 'username', 'email'],
                    include: [
                        { model: Profile, as: 'profile', attributes: ['name', 'lastname'] }
                    ]
                }
            ]
        });

        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

        const obj = post.toJSON();
        obj.user = obj.usuario || null;
        if (obj.user && obj.user.profile && (obj.user.profile.name || obj.user.profile.lastname)) {
            obj.user_name = `${obj.user.profile.name || ''}${obj.user.profile.lastname ? ' ' + obj.user.profile.lastname : ''}`.trim();
        } else if (obj.user && obj.user.username) {
            obj.user_name = obj.user.username;
        } else {
            obj.user_name = null;
        }

        res.status(200).json(obj);
    } catch (error) {;
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};

export const createPost = async (req, res) => {
    try {
        // Debug: show incoming authorization header to troubleshoot "Token requerido"
        console.log('createPost - Authorization header:', req.headers.authorization);

        const { title, content, price, brand, market_id, product_id, offer_id } = req.body;
        
        // Require an uploaded image
        if (!req.file) {
            return res.status(400).json({ message: 'Se requiere una imagen del producto (campo: image).' });
        }

        // Validar datos requeridos
        if (!title || !content || !price || !market_id || !product_id) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos",
                required: ["title", "content", "price", "market_id", "product_id", "image"]
            });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const createPost = await PostModel.create({
            title,
            content,
            price,
            brand,
            market_id,
            product_id,
            offer_id: offer_id || null,
            image: imagePath,
            user_id: req.user.id
        });

        res.status(201).json({
            message: "Publicación creada correctamente",
            post: createPost
        });
        
    } catch (error) {
        console.error("Error al crear post:", error);
        res.status(500).json({ 
            message: "Error al crear la publicación",
            error: error.message
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await PostModel.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

        // Only owner or admin can update
        const requester = req.user;
        if (requester.role !== 'admin' && requester.id !== post.user_id) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
        }

        await PostModel.update(req.body, { where: { id: req.params.id } });
        const updated = await PostModel.findByPk(req.params.id);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Publicación no encontrada' });

        // Only the owner or an admin can delete
        const requester = req.user;
        if (requester.role !== 'admin' && requester.id !== post.user_id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
        }

                await post.destroy();

                try {
                    // record deletion audit
                    await DeletionLog.create({
                        post_id: post.id,
                        deleted_by: requester.id,
                        deleted_by_username: requester.username || requester.name || null,
                        deleted_at: new Date()
                    });
                } catch (e) {
                    console.error('Error creating deletion log:', e);
                }

                res.status(200).json({ message: 'Publicación eliminada' });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};