import React, { useState, useEffect, useCallback } from 'react';
import { entitiesService } from '../../api/entities.service.js';
import MarketForm from '../../components/admin/MarketForm.jsx';

const MarketAdminPage = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await entitiesService.getAllMarkets();
      setMarkets(data);
    } catch (error) {
      console.error("Error al cargar mercados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const handleDelete = async (marketId) => {
    if (!window.confirm(`¿Estás seguro de eliminar el comercio ID ${marketId}?`)) return;
    try {
      await entitiesService.deleteMarket(marketId);
      fetchMarkets(); 
    } catch (error) {
      alert(error.response?.data?.msj || "Error al eliminar. Revisa si tienes permisos de admin.");
    }
  };

  if (loading) {
    return <div>Cargando comercios...</div>;
  }

  return (
    <div>
      <h2>Administración de Locales/Comercios (Solo Admin)</h2>
      
      <MarketForm onSave={fetchMarkets} />

      <h4>Lista de Comercios</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {markets.map(m => (
          <li key={m.id} style={{ padding: '5px', borderBottom: '1px dotted #ccc' }}>
            <span>
                ID {m.id}: **{m.name}** ({m.type}) en {m.location}
            </span>
            <button onClick={() => handleDelete(m.id)} style={{ color: 'red', marginLeft: '10px' }}>Eliminar</button>
          </li>
        ))}
      </ul>
      {markets.length === 0 && <p>No hay comercios registrados.</p>}
    </div>
  );
};

export default MarketAdminPage;