import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
    }
);

export const startDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("La base de datos se conectó correctamente");
        // Ensure models and DB schema are in sync. Use `alter: true` to update tables
        // without dropping data (use with caution in production).
        await sequelize.sync({ alter: true });
        console.log('Sequelize sync completed (alter: true)');
    } catch (error) {
        console.log(`Error al conectarse con la base de datos`, error);
    }
};