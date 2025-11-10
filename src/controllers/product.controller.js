import { ProductModel } from "../models/product.model.js";

export const getAllProduct = async (req, res) => {
    try {
        const products = await ProductModel.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findByPk(req.params.id);
        res.status(200).json(product)
    } catch (error) {;
        res.status(500).json({ message: "", error});
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        
        // Validar campos requeridos
        if (!name || !description || !price || !stock || !categoryId) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos", 
                error: "Todos los campos son obligatorios excepto la imagen" 
            });
        }

        // Si hay un archivo de imagen, usa su ruta
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        const productData = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            categoryId: parseInt(categoryId),
            image: imageUrl
        };

        const createProduct = await ProductModel.create(productData);
        res.status(201).json(createProduct);
        
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            message: "Error al crear el producto", 
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        
        // Preparar los datos a actualizar
        const updateData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price: parseFloat(price) }),
            ...(stock && { stock: parseInt(stock) }),
            ...(categoryId && { categoryId: parseInt(categoryId) })
        };

        // Si hay una nueva imagen
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updateProduct = await ProductModel.update(updateData, {
            where: { id: req.params.id }
        });

        if(updateProduct[0] > 0){
            const product = await ProductModel.findByPk(req.params.id);
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: "Error al actualizar el producto", 
            error: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByPk(req.params.id);
        product.destroy();
        res.status(200).json({msj: "Categoría eliminada"})
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

