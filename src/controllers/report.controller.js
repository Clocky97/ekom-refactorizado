import Report from "../models/report.model.js";

export const createReport = async (req, res) => {
  const { postId, reason } = req.body;
  const userId = req.user.id;
  // Evita reportes duplicados
  const exists = await Report.findOne({ where: { userId, postId } });
  if (exists) return res.status(400).json({ error: "Ya reportaste este post" });
  const report = await Report.create({ userId, postId, reason });
  res.json(report);
};