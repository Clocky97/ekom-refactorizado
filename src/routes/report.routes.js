import { Router } from "express";
import { createReport, getReports } from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/report", auth, createReport);
router.get("/report", auth, getReports);

export default router;