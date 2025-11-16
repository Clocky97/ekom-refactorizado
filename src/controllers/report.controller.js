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
    const reports = await Report.findAll({
      include: [
        {
          association: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          association: 'post',
          attributes: ['id', 'title', 'content', 'image', 'user_id', 'createdAt'],
          include: [
            {
              association: 'usuario',
              attributes: ['id', 'username', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Error en getReports:', error);
    res.status(500).json({ error: 'Error al obtener los reportes', details: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    await report.destroy();
    res.json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el reporte' });
  }
};