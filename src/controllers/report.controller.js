import Report from "../models/report.model.js";

export const createReport = async (req, res) => {
  console.log('createReport - Authorization header:', req.headers.authorization);
  const { postId, reason } = req.body;
  const userId = req.user.id;
  // Evita reportes duplicados
  const exists = await Report.findOne({ where: { userId, postId } });
  if (exists) return res.status(400).json({ error: "Ya reportaste este post" });
  const report = await Report.create({ userId, postId, reason });
  res.json(report);
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
};