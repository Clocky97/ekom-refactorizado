import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const OfferModel = sequelize.define(
    "offer", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)