import React, { useState } from 'react';
import { entitiesService } from '../../api/entities.service';
import './AdminStyles.css'; // RECOMENDADO: centralizamos el estilo marrón

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
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al crear el comercio.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-card">
      <h3 className="adm-title">Crear Nuevo Local / Comercio</h3>

      {error && <p className="adm-error">{error}</p>}

      <form className="adm-form" onSubmit={handleSubmit}>
        <label className="adm-label">Nombre</label>
        <input
          className="adm-input"
          type="text"
          name="name"
          placeholder="Nombre del local"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label className="adm-label">Ubicación</label>
        <input
          className="adm-input"
          type="text"
          name="location"
          placeholder="Dirección / Ubicación"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label className="adm-label">Tipo de Comercio</label>
        <select
          name="type"
          className="adm-input"
          value={formData.type}
          onChange={handleChange}
          required
        >
          {MARKET_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button className="adm-btn" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Guardar Comercio"}
        </button>
      </form>
    </div>
  );
};

export default MarketForm;
