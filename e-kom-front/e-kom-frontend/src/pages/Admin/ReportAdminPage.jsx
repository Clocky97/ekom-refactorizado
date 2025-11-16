import { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../../api/reports.service.js';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/Common/ConfirmModal';

// IMPORTANTE → estilo unificado de admin
import '../../components/admin/AdminStyles.css';

const ReportAdminPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const { showToast } = useToast();

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      showToast('Error al cargar los reportes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReport(selectedReport.id);
      showToast('Reporte eliminado exitosamente', 'success');
      fetchReports();
    } catch (error) {
      showToast('Error al eliminar el reporte', 'error');
    } finally {
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando reportes...</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">📢 Gestión de Reportes</h1>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.user?.username || 'Desconocido'}</td>
                <td>{report.reason}</td>
                <td>{new Date(report.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(report)}
                    className="admin-btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <p className="admin-empty">No hay reportes registrados.</p>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Reporte"
        message={`¿Estás seguro de eliminar el reporte #${selectedReport?.id}?`}
      />
    </div>
  );
};

export default ReportAdminPage;
