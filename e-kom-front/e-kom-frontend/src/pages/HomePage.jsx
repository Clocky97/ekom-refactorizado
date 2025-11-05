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

  const handleDelete = async (postId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        await postsService.deletePost(postId);
        loadPosts(); // Refresh posts after deletion
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.response?.data?.message || "Error al eliminar la publicación");
      }
    }
  };

  const handlePostCreated = () => {
    loadPosts();
    setShowPostForm(false);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="home-header">
          <h1>E-KOM</h1>
          <p className="subtitle">Encuentra y comparte las mejores ofertas</p>
        </div>

        <div className="category-filter">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorías
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* El botón 'Nueva Publicación' se removió del sidebar por petición del usuario */}

        {!isAuthenticated && (
          <div className="auth-prompt mt-4">
            <p className="text-sm text-gray-600">¿Quieres compartir una oferta? Inicia sesión o regístrate</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showPostForm && (
          <div className="post-form-container">
            <PostForm onPostCreated={handlePostCreated} />
          </div>
        )}

        {loading ? (
          <div className="loading flex justify-center items-center min-h-[200px]">
            Cargando publicaciones...
          </div>
        ) : (
          <div className="posts-container">
            {posts.length > 0 ? (
              posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onUpdate={loadPosts}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="no-posts">
                <p>No hay publicaciones disponibles{selectedCategory && ' en esta categoría'}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;