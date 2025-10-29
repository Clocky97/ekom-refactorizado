import { CategoryModel } from "../models/category.model.js";

export const getAllCategory = async (req, res) => {
    try {
        const categorys = await CategoryModel.findAll();
        res.status(200).json(categorys);
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await CategoryModel.findByPk(req.params.id);
        res.status(200).json(category)
    } catch (error) {;
        res.status(500).json({ message: "", error});
    }
};

export const createCategory = async (req, res) => {
    try {
        const createCategory = await CategoryModel.create(req.body);
        res.status(201).json(createCategory);
        
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const updateCategory = async (req, res) => {
    try {
        const updateCategory = await CategoryModel.update(req.body, {
            where: {id: req.params.id}
        })
        if(updateCategory){
            const category = await CategoryModel.findByPk(req.params.id);
            res.status(200).json(category)
        }
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findByPk(req.params.id);
        await category.destroy();
        res.status(200).json({msj: "Categoría eliminada"})
    } catch (error) {
        res.status(500).json({ message: "", error});
    }
};



