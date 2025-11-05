import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const DeletionLog = sequelize.define('deletion_log', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  post_id: { type: DataTypes.INTEGER, allowNull: false },
  deleted_by: { type: DataTypes.INTEGER, allowNull: false },
  deleted_by_username: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  reason: { type: DataTypes.STRING, allowNull: true }
});

export default DeletionLog;
