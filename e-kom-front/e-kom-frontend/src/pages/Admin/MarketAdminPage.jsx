import React, { useState, useEffect, useCallback } from 'react';
import { entitiesService } from '../../api/entities.service.js';
import MarketForm from '../../components/admin/MarketForm.jsx';
import '../../components/admin/AdminStyles.css';

const MarketAdminPage = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await entitiesService.getAllMarkets();
      setMarkets(data);
    } catch (error) {
      console.error("Error al cargar comercios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const handleDelete = async (marketId) => {
    if (!window.confirm(`¿Eliminar el comercio ID ${marketId}?`)) return;

    try {
      await entitiesService.deleteMarket(marketId);
      fetchMarkets();
    } catch (error) {
      alert(error.response?.data?.msj || "Error al eliminar el comercio.");
    }
  };

  if (loading) {
    return <div className="adm-loading">Cargando comercios...</div>;
  }

  return (
    <div className="adm-container">
      <h2 className="adm-page-title">Administración de Locales / Comercios</h2>

      <MarketForm onSave={fetchMarkets} />

      <h3 className="adm-subtitle">Lista de Comercios</h3>

      <ul className="adm-list">
        {markets.map(m => (
          <li key={m.id} className="adm-list-item">
            <span>
              <strong>ID {m.id}</strong>: {m.name} ({m.type}) – {m.location}
            </span>

            <button
              className="adm-btn-delete"
              onClick={() => handleDelete(m.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {markets.length === 0 && (
        <p className="adm-empty">No hay comercios registrados.</p>
      )}
    </div>
  );
};

export default MarketAdminPage;
