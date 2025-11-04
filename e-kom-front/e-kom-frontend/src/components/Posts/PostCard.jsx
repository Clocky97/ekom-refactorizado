import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsService } from '../../api/posts.service';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const isOwner = isAuthenticated && user.id === post.user_id;

  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const avg = await postsService.getAverageRating(post.id);
        setAverageRating(avg);
      } catch (error) {
        console.error("Error al obtener rating:", error);
      }
    };
    fetchRating();
  }, [post.id]);

  const handleRate = async (score) => {
    if (!isAuthenticated) return alert("Debes iniciar sesión para calificar.");
    try {
      // Debug: show token presence
      console.log('handleRate - localStorage token:', localStorage.getItem('token'));
      console.log('handleRate - axios Authorization header:', (await import('../../api/api')).default.defaults.headers.common.Authorization);
      await postsService.ratePost(post.id, score);
      const newAvg = await postsService.getAverageRating(post.id);
      setAverageRating(newAvg);
      alert(`Has calificado el post con ${score} estrellas.`);
    } catch (error) {
      console.error('Error al calificar:', error);
      alert(error.response?.data?.message || 'Error al calificar.');
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) return alert("Debes iniciar sesión para reportar.");
    const reason = prompt("Por favor, ingresa la razón del reporte:");
    if (!reason) return;

    try {
      // Debug: show token presence
      console.log('handleReport - localStorage token:', localStorage.getItem('token'));
      console.log('handleReport - axios Authorization header:', (await import('../../api/api')).default.defaults.headers.common.Authorization);
      await postsService.createReport(post.id, reason);
      alert("Publicación reportada correctamente.");
    } catch (error) {
      console.error('Error al reportar:', error);
      alert(error.response?.data?.error || "Error al reportar el post.");
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', margin: '10px', maxWidth: '400px' }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p><strong>Precio:</strong> ${post.price}</p>
      <p><strong>Marca:</strong> {post.brand}</p>
      <p><strong>Local ID:</strong> {post.market_id || 'Desconocido'}</p>
      <p>
        **Calificación Promedio:** {averageRating.toFixed(2)} ⭐
      </p>

      {isOwner && (
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => onUpdate(post.id)}>Editar</button>
          <button onClick={() => onDelete(post.id)} style={{ marginLeft: '10px' }}>
            Eliminar
          </button>
        </div>
      )}
      
      {isAuthenticated && !isOwner && (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <span>Calificar: </span>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => handleRate(n)} style={{ marginLeft: 6 }}>
                {n}⭐
              </button>
            ))}
          </div>
          <button onClick={handleReport} style={{ backgroundColor: 'red', color: 'white' }}>
            Reportar
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;