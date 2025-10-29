import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PostCard from '../components/Posts/PostCard.jsx';
import PostForm from '../components/Posts/PostForm.jsx';
import { postsService } from '../api/posts.service.js';
import { entitiesService } from '../api/entities.service.js';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    loadCategories();
    loadPosts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await entitiesService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = selectedCategory
        ? await postsService.getPostsByCategory(selectedCategory)
        : await postsService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadPosts();
    setShowPostForm(false);
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>E-KOM</h1>
        <p className="subtitle">Encuentra y comparte las mejores ofertas</p>
      </div>

      <div className="controls-section">
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {isAuthenticated && (
          <button 
            className="btn-primary"
            onClick={() => setShowPostForm(!showPostForm)}
          >
            {showPostForm ? 'Cancelar' : 'Nueva Publicación'}
          </button>
        )}
      </div>

      {showPostForm && (
        <PostForm onPostCreated={handlePostCreated} />
      )}

      {loading ? (
        <div className="loading">Cargando publicaciones...</div>
      ) : (
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post}
                onUpdate={loadPosts}
              />
            ))
          ) : (
            <div className="no-posts">
              <p>No hay publicaciones disponibles{selectedCategory && ' en esta categoría'}.</p>
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-prompt">
          <p>¿Quieres compartir una oferta? Inicia sesión o regístrate</p>
        </div>
      )}
    </div>
  );
};
export default HomePage;