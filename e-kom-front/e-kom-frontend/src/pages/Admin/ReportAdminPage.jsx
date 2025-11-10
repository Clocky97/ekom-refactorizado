import { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../../api/reports.service.js';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/Common/ConfirmModal';

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
    return <div className="text-center p-4">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes de la plataforma</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.user?.username || 'Desconocido'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{report.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(report.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteClick(report)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Reporte"
        message={`¿Estás seguro de que deseas eliminar el reporte #${selectedReport?.id}?`}
      />
    </div>
  );
};

export default ReportAdminPage;
