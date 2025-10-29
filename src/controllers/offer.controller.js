import { OfferModel } from "../models/offer.model.js";

export const getAllOffers = async (req, res) => {
    try {
        const offers = await OfferModel.findAll();
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const getOfferById = async (req, res) => {
    try {
        const offer = await OfferModel.findByPk(req.params.id);
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const createOffer = async (req, res) => {
    const {name, description} = req.body;
    try {
        const createOffer = await OfferModel.create({
            name: name,
            description: description
        });
        res.status(201).json(createOffer);
        
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const updateOffer = async (req, res) => {
    const {name, description} = req.body;
    try {
        const offer = await OfferModel.update({
            name: name,
            description: description
        });
        res.status(200).json(offer);
        
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const deleteOffer = async (req, res) => {
    try {
        await OfferModel.findByPk(req.params.id);
        res.status(200).json({
            message: "Oferta eliminada correctamente"
        });
        
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};