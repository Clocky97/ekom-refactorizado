import React, { useState } from 'react';
import { entitiesService } from '../../api/entities.service';
import './AdminStyles.css'; // NUEVO CSS EXCLUSIVO DEL PANEL ADMIN

const CategoryForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await entitiesService.createCategory({ name });
      setName('');
      onSave(); 
    } catch (err) {
      console.error("Error al crear categoría:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Error al crear la categoría.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-card">
      <h4 className="adm-title-sm">Crear Nueva Categoría</h4>

      {error && <p className="adm-error">{error}</p>}

      <form onSubmit={handleSubmit} className="adm-form">
        <input 
          type="text"
          className="adm-input"
          placeholder="Nombre de la categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="adm-btn">
          {loading ? 'Creando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
