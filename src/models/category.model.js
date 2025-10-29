import { sequelize } from "../config/database.js"; 
import { DataTypes } from "sequelize";

export const CategoryModel = sequelize.define(
    "Category", {
        "name": {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        paranoid: true
    }
)