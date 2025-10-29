import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/report", auth, createReport);

export default router;