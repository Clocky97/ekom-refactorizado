import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.model.js";

export const PostModel = sequelize.define(
    "post", {
        "title": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "content": {  //contenido del posteo
            type: DataTypes.TEXT, 
            allowNull: false
        },
        "user_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "market_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "offer_id": {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        "category_id": {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
)
