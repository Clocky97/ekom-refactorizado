import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const Profile = sequelize.define("profile", {
    name: { type: DataTypes.STRING(100), allowNull: false },
    lastname: { type: DataTypes.STRING(100), allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: true },
    user_id: {type: DataTypes.INTEGER},
    avatar: { type: DataTypes.STRING(255), allowNull: true },
}); 

export default Profile;