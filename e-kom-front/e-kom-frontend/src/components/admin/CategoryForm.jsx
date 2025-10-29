import React, { useState } from 'react';
import { entitiesService } from '../../api/entities.service';

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
    <div style={{ padding: '15px', border: '1px solid green', marginBottom: '20px' }}>
      <h4>Crear Nueva Categoría</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nombre de la categoría" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? 'Creando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;