import React, { useState, useEffect, useCallback } from 'react';
import { postsService } from '../api/posts.service';
import PostCard from '../components/Posts/PostCard';
import PostForm from '../components/Posts/PostForm';
import { useAuth } from '../context/AuthContext';

const PostsPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postsService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error al cargar posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreateClick = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return;
    try {
      await postsService.deletePost(postId);
      alert('Publicación eliminada.');
      fetchPosts(); 
    } catch (error) {
      alert(error.response?.data?.msj || "Error al eliminar la publicación.");
    }
  };

  if (loading) {
    return <div>Cargando publicaciones...</div>;
  }

  return (
    <div>
      <h1>Publicaciones y Ofertas</h1>

      {isAuthenticated && (
        <button onClick={handleCreateClick} style={{ marginBottom: '20px' }}>
          Crear Nueva Publicación
        </button>
      )}

      {showForm && (
        <PostForm
          postToEdit={editingPost}
          onClose={() => setShowForm(false)}
          onSave={fetchPosts}
        />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onUpdate={handleEditClick}
            />
          ))
        ) : (
          <p>No hay publicaciones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PostsPage;