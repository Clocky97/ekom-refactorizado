import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Rating = sequelize.define("Rating", {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
});

export default Rating;