import { DataTypes, STRING } from "sequelize";
import { sequelize } from "../config/database.js";
import { CategoryModel } from "./category.model.js";

export const ProductModel = sequelize.define(
    "product",{
        "product_name": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "brand": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "image": {
            type: DataTypes.STRING,
            allowNull: false
        },
        "category_id": {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
        
    }
)
