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
        const createProduct = await ProductModel.create(req.body);
        res.status(201).json(createProduct);
        
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updateProduct = await ProductModel.update(req.body, {
            where: {id: req.params.id}
        })
        if(updateProduct){
            const product = await ProductModel.findByPk(req.params.id);
            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json({ message: "", error});
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

