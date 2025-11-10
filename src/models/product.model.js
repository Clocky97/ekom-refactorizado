import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../config/database.js";
import { CategoryModel } from "./category.model.js";

export const ProductModel = sequelize.define(
    "product", {
        "name": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "description": {
            type: DataTypes.TEXT,
            allowNull: false
        },
        "price": {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        "stock": {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "image": {
            type: DataTypes.STRING,
            allowNull: true
        },
        "categoryId": {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "category_id"
        }
    }
)
