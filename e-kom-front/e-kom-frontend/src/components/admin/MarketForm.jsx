import React, { useState } from 'react';
import { entitiesService } from '../../api/entities.service';

const MarketForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'SuperMercado', 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const MARKET_TYPES = ["SuperMercado", "miniMercado", "kiosco"]; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await entitiesService.createMarket(formData);
      setFormData({ name: '', location: '', type: 'SuperMercado' });
      onSave(); 
    } catch (err) {
      console.error("Error al crear mercado:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error al crear el comercio.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid orange', marginBottom: '20px' }}>
      <h4>Crear Nuevo Local/Comercio</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre del Local" value={formData.name} onChange={handleChange} required /><br />
        <input type="text" name="location" placeholder="Dirección/Ubicación" value={formData.location} onChange={handleChange} required /><br />
        <select name="type" value={formData.type} onChange={handleChange} required>
          {MARKET_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select><br />
        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Creando...' : 'Guardar Comercio'}
        </button>
      </form>
    </div>
  );
};

export default MarketForm;