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
    <div className="relative inline-block">
      <button 
        onClick={handleIconClick} 
        className="bg-none border-none cursor-pointer relative p-2 hover:opacity-70 transition"
      >
        <BellIcon hasReports={reports.length > 0} />
        {reports.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {reports.length}
          </span>
        )}
      </button>
      {showModal && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 min-w-80 max-w-md">
          <div className="p-5 border-b border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🔔</span>
              Reportes recientes
            </h4>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {reports.length === 0 ? (
              <div className="p-5 text-center text-slate-600">
                <p className="text-sm">No hay reportes nuevos.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {reports.slice(0, 5).map(report => (
                  <li key={report.id} className="p-4 hover:bg-slate-50 transition">
                    <p className="text-sm">
                      <span className="font-bold text-blue-600">#{report.id}</span>
                      <span className="text-slate-600"> - </span>
                      <span className="text-slate-700">{report.reason}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-200 p-4 space-y-2">
            <button
              onClick={handleGoToReports}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition flex items-center justify-center gap-2"
            >
              <span>📊</span>
              Ver todos los reportes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition"
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
