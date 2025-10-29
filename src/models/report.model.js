import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Report = sequelize.define("Report", {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Report;