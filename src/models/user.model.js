import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("user", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  username: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(100), allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
