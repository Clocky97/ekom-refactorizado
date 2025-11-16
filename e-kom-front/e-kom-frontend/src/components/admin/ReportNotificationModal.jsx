import { useState, useEffect } from 'react';
import { getReports } from '../../api/reports.service';
import { useNavigate } from 'react-router-dom';

const BellIcon = ({ hasReports }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ReportNotificationModal = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch {
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="relative inline-block">

      {/* Botón de campana */}
      <button
        onClick={() => setShowModal(true)}
        className="report-bell-btn"
      >
        <BellIcon hasReports={reports.length > 0} />

        {reports.length > 0 && (
          <span className="report-bell-count">
            {reports.length}
          </span>
        )}
      </button>

      {/* ===========================
            MODAL CENTRADO
          =========================== */}
      {showModal && (
        <>
          {/* Fondo oscuro */}
          <div
            className="report-modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Contenedor centrado */}
          <div className="report-modal-centered">
            <div className="report-modal">

              <div className="report-modal-header">
                🔔 Reportes recientes
              </div>

              <div className="report-modal-body">
                {reports.length === 0 ? (
                  <div className="p-4 text-slate-600">
                    No hay reportes nuevos.
                  </div>
                ) : (
                  <ul>
                    {reports.slice(0, 5).map((report) => (
                      <li key={report.id} className="report-modal-item">
                        <span className="notif-id">#{report.id}</span>{' - '}
                        {report.reason}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="report-modal-footer">
                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate('/admin/reports');
                  }}
                  className="admin-btn-primary"
                >
                  📊 Ver todos los reportes
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="admin-btn-light"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportNotificationModal;
