import { MarketModel } from "../models/market.model.js";


export const getAllMarkets = async (req, res) => {
    try {
        const markets = await MarketModel.findAll();
        res.status(200).json(markets);
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const getMarketById = async (req, res) => {
    try {
        const market = await MarketModel.findByPk(req.params.id);
        res.status(200).json(market);
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};


export const createMarket = async (req, res) => {
    try {
        const createMarket = await MarketModel.create(req.body);
        res.status(201).json(createMarket);
        
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const updateMarket = async (req, res) => {
    try {
        const updateMarket = await MarketModel.update(req.body, {
            where: {id: req.params.id}
        })
        if(updateMarket){
            const market = await MarketModel.findByPk(req.params.id);
            res.status(200).json(market)
        }
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};

export const deleteMarket = async (req, res) => {
    try {
        const market = await MarketModel.findByPk(req.params.id);
        await market.destroy();
        res.status(200).json({msj: "Comercio eliminado"})
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
        console.log(error)
    }
};



