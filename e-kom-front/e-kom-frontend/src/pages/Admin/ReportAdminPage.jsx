import { useState, useEffect } from 'react';
import api from '../../api/api.js';
import { getReports, deleteReport } from '../../api/reports.service.js';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/Common/ConfirmModal';

// IMPORTANTE → estilo unificado de admin
import '../../components/admin/AdminStyles.css';

const ReportAdminPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
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

  const handleViewPost = (report) => {
    setSelectedReport(report);
    setShowPostModal(true);
  };

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

  const serverBase = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/ekom\/?$/, '') : '';

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
                <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleViewPost(report)}
                    className="admin-btn-view"
                  >
                    Ver Post
                  </button>
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

      {/* Modal para ver el post reportado */}
      {showPostModal && selectedReport?.post && (
        <div className="report-post-modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="report-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-post-modal-header">
              <h2>📋 Post Reportado</h2>
              <button 
                className="report-post-modal-close" 
                onClick={() => setShowPostModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="report-post-modal-body">
              {/* Razón del reporte */}
              <div className="report-reason-section">
                <h4>Motivo del Reporte:</h4>
                <p className="report-reason-text">{selectedReport.reason}</p>
                <p className="report-info-small">
                  Reportado por: <strong>{selectedReport.user?.username}</strong> 
                  {' • '}
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Post */}
              <div className="report-post-content">
                <h3>{selectedReport.post.title}</h3>
                <p className="report-post-body">{selectedReport.post.content}</p>
                <p className="report-post-meta">
                  Autor: <strong>{selectedReport.post.usuario?.username}</strong>
                  {' • '}
                  {new Date(selectedReport.post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="report-post-modal-footer">
              <button
                className="report-btn-close"
                onClick={() => setShowPostModal(false)}
              >
                Cerrar
              </button>
              <button
                className="report-btn-delete"
                onClick={() => {
                  setShowPostModal(false);
                  handleDeleteClick(selectedReport);
                }}
              >
                Eliminar Reporte
              </button>
            </div>
          </div>
        </div>
      )}

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
