import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const MarketModel = sequelize.define(
    "market", {
        "name": {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING, //si guardamos la ubi segun calle y altura
            allowNull: false
        },
        "type": {
            type: DataTypes.ENUM("SuperMercado", "miniMercado", "kiosco"),
            allowNull: false   
        }
    }
);