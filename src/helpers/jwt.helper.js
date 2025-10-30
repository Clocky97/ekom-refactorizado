import jwt from "jsonwebtoken";
import dotenv from"dotenv";

dotenv.config();

export const generateToken = (user) => {
    const token = jwt.sign({
            id: user.id,
            name: user.name || '',
            lastname: user.lastname || '',
            role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.EXPIRES_IN
    }
    );

    return token;
};


export const verifyToken = (token) => {
    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        return tokenDecoded;
    } catch (error) {
         throw new Error("Error al verificar el token: " + error.message);
    }
}