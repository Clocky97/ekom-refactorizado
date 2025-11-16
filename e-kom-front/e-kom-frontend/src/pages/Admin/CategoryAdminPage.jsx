import React, { useState, useEffect, useCallback } from 'react';
import { entitiesService } from '../../api/entities.service.js';
import CategoryForm from '../../components/admin/CategoryForm.jsx';
import '../../components/admin/AdminStyles.css'; 

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
      alert(error.response?.data?.msj || "Error al eliminar. Revisa permisos.");
    }
  };

  if (loading) {
    return <div className="adm-loading">Cargando categorías...</div>;
  }

  return (
    <div className="adm-page">

      <h2 className="adm-title">Administración de Categorías</h2>

      {/* Formulario */}
      <CategoryForm onSave={fetchCategories} />

      <h4 className="adm-subtitle">Lista de Categorías</h4>

      {categories.length === 0 && (
        <p className="adm-empty">No hay categorías.</p>
      )}

      <ul className="adm-list">
        {categories.map(cat => (
          <li key={cat.id} className="adm-list-item">
            <span>ID {cat.id}: {cat.name}</span>

            <button
              onClick={() => handleDelete(cat.id)}
              className="adm-delete-btn"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default CategoryAdminPage;
