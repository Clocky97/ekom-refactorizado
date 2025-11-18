import { PostModel } from "../models/post.model.js";
import { User, Profile } from "../models/relations.index.js";
import { MarketModel } from "../models/market.model.js";
import { CategoryModel } from "../models/category.model.js";
import { OfferModel } from "../models/offer.model.js";
import DeletionLog from "../models/deletion.model.js";
import Report from "../models/report.model.js";
import Rating from "../models/rating.model.js";
import PostOffer from "../models/postOffer.model.js";
import CartModel from "../models/cart.model.js";
import fs from 'fs';
import path from 'path';
import { sequelize } from "../config/database.js";

export const getAllPost = async (req, res) => {
    try {
        // Include the post owner (user), their profile, the market, and category so frontend can display names
        const posts = await PostModel.findAll({
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['id', 'username', 'email'],
                    include: [
                        { model: Profile, as: 'profile', attributes: ['name', 'lastname'] }
                    ]
                },
                {
                    model: MarketModel,
                    as: 'local',
                    attributes: ['id', 'name', 'type']
                },
                {
                    model: CategoryModel,
                    as: 'categoria',
                    attributes: ['id', 'name']
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
            // Add market name for frontend display
            obj.market_name = obj.local?.name || 'Desconocido';
            // Add category name for frontend display
            obj.category_name = obj.categoria?.name || null;
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
                },
                {
                    model: MarketModel,
                    as: 'local',
                    attributes: ['id', 'name', 'type']
                },
                {
                    model: CategoryModel,
                    as: 'categoria',
                    attributes: ['id', 'name']
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
        // Add market name for frontend display
        obj.market_name = obj.local?.name || 'Desconocido';
        // Add category name for frontend display
        obj.category_name = obj.categoria?.name || null;

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

        const { title, content, price, brand, market_id, category_id, offer_id, custom_offer_percent } = req.body;
        
        // Require an uploaded image
        if (!req.file) {
            return res.status(400).json({ message: 'Se requiere una imagen del producto (campo: image).' });
        }

        // Validar datos requeridos
        if (!title || !content || !price || !market_id || !category_id) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos",
                required: ["title", "content", "price", "market_id", "category_id", "image"]
            });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const createPost = await PostModel.create({
            title,
            content,
            price,
            brand,
            market_id,
            category_id,
            offer_id: offer_id || null,
            custom_offer_percent: custom_offer_percent ? Number(custom_offer_percent) : null,
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

                const postId = post.id;

                console.log(`deletePost: starting deletion for post ${postId} by user ${requester.id}`);

                // Run deletion in a transaction so it's atomic
                const t = await sequelize.transaction();
                try {
                    // Delete related records
                    await CartModel.destroy({ where: { post_id: postId }, transaction: t });
                    await PostOffer.destroy({ where: { post_id: postId }, transaction: t });
                    // Reports and ratings might use different field names depending on migrations
                    await Report.destroy({ where: { post_id: postId }, transaction: t });
                    await Report.destroy({ where: { postId: postId }, transaction: t });
                    await Rating.destroy({ where: { post_id: postId }, transaction: t });
                    await Rating.destroy({ where: { postId: postId }, transaction: t });

                    // Remove image file from uploads folder if exists
                    if (post.image) {
                        try {
                            const filename = path.basename(post.image);
                            const uploadsDir = path.resolve(process.cwd(), 'uploads');
                            const filePath = path.join(uploadsDir, filename);
                            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        } catch (e) {
                            console.error('Error removing image file for post (will continue):', e);
                        }
                    }

                    // Destroy post row (force to bypass paranoid soft-delete if enabled)
                    await PostModel.destroy({ where: { id: postId }, force: true, transaction: t });

                    // Record deletion audit
                    await DeletionLog.create({
                        post_id: postId,
                        deleted_by: requester.id,
                        deleted_by_username: requester.username || requester.name || null,
                        deleted_at: new Date()
                    }, { transaction: t });

                    await t.commit();
                    console.log(`deletePost: commit successful for post ${postId}`);
                    return res.status(200).json({ message: 'Publicación eliminada' });
                } catch (e) {
                    console.error('deletePost: error during transaction, rolling back:', e);
                    try { await t.rollback(); } catch (rbErr) { console.error('Rollback failed:', rbErr); }
                    return res.status(500).json({ message: 'Error al eliminar la publicación', error: e.message });
                }
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};