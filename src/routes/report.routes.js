import { Router } from "express";
import { createReport, getReports, deleteReport } from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/report", auth, createReport);
router.get("/report", auth, getReports);
router.delete("/report/:id", auth, deleteReport);

export default router;