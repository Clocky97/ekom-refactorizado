
import express from "express";
import "dotenv/config";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import userRouter from "./src/routes/user.routes.js";
import profileRouter from "./src/routes/profile.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import postRouter from "./src/routes/post.routes.js";
import marketRouter from "./src/routes/market.routes.js";
import ratingRouter from "./src/routes/rating.routes.js";
import reportRouter from "./src/routes/report.routes.js";
import cookieParser from "cookie-parser";
import { offerRoutes } from "./src/routes/offer.routes.js";
import postOfferRoutes from "./src/routes/postOffer.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";



const app = express();
const PORT = process.env.PORT || 1212;

// Habilitar CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.use("/ekom", userRouter);
app.use("/ekom", profileRouter);
app.use("/ekom", categoryRouter);
app.use("/ekom", postRouter);
app.use("/ekom", offerRoutes);
app.use("/ekom", postOfferRoutes);
app.use("/ekom", marketRouter);
app.use("/ekom", ratingRouter);
app.use("/ekom", reportRouter);
app.use("/ekom", cartRoutes);

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    await startDB();
});
