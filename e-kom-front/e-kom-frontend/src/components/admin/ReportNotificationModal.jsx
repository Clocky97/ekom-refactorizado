import { useState, useEffect } from 'react';
import { getReports } from '../../api/reports.service';
import { useNavigate } from 'react-router-dom';

const BellIcon = ({ hasReports }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    {hasReports && (
      <circle cx="20" cy="6" r="4" fill="#ef4444" />
    )}
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
      } catch (error) {
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  const handleIconClick = () => {
    setShowModal(true);
  };

  const handleGoToReports = () => {
    setShowModal(false);
    navigate('/admin/reports');
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={handleIconClick} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
        <BellIcon hasReports={reports.length > 0} />
        {reports.length > 0 && (
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            minWidth: '20px',
            textAlign: 'center',
          }}>{reports.length}</span>
        )}
      </button>
      {showModal && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 100,
          minWidth: '260px',
        }}>
          <div style={{ padding: '16px' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Reportes recientes</h4>
            {reports.length === 0 ? (
              <p>No hay reportes nuevos.</p>
            ) : (
              <ul style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '12px' }}>
                {reports.slice(0, 5).map(report => (
                  <li key={report.id} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ fontWeight: 'bold' }}>#{report.id}</span> - {report.reason}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handleGoToReports}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
              }}
            >
              Ver todos los reportes
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'none',
                color: '#555',
                border: 'none',
                marginTop: '8px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportNotificationModal;
