import { PostModel } from "../models/post.model.js";

export const getAllPost = async (req, res) => {
    try {
        const posts = await PostModel.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const getPostById = async (req, res) => {
    try {
        const user = await req.user;
        const post = await PostModel.findByPk(user.id);
        res.status(200).json(post)
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
        
        // Validar datos requeridos
        if (!title || !content || !price || !market_id || !product_id) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos",
                required: ["title", "content", "price", "market_id", "product_id"]
            });
        }

        const createPost = await PostModel.create({
            title,
            content,
            price,
            brand,
            market_id,
            product_id,
            offer_id: offer_id || null,
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
        const updatePost = await PostModel.update(req.body, {
            where: {id: req.params.id}
        })
        if(updatePost){
            const post = await PostModel.findByPk(req.params.id);
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findByPk(req.params.id);
        post.destroy();
        res.status(200).json({msj: "Categoría eliminada"})
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor"});
        console.log(error)
    }
};