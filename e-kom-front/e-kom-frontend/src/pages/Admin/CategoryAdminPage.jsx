import React, { useState, useEffect, useCallback } from 'react';
import { entitiesService } from '../../api/entities.service.js';
import CategoryForm from '../../components/admin/CategoryForm.jsx';

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await entitiesService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (categoryId) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría ID ${categoryId}?`)) return;
    try {
      await entitiesService.deleteCategory(categoryId);
      fetchCategories(); 
    } catch (error) {
      alert(error.response?.data?.msj || "Error al eliminar. Revisa si tienes permisos de admin.");
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  return (
    <div>
      <h2>Administración de Categorías (Solo Admin)</h2>
      
      <CategoryForm onSave={fetchCategories} />

      <h4>Lista de Categorías</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {categories.map(cat => (
          <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', borderBottom: '1px dotted #ccc' }}>
            <span>ID {cat.id}: {cat.name}</span>
            <button onClick={() => handleDelete(cat.id)} style={{ color: 'red' }}>Eliminar</button>
          </li>
        ))}
      </ul>
      {categories.length === 0 && <p>No hay categorías.</p>}
    </div>
  );
};

export default CategoryAdminPage;