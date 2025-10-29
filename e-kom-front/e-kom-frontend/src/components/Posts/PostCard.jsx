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
      await postsService.ratePost(post.id, score);
      const newAvg = await postsService.getAverageRating(post.id);
      setAverageRating(newAvg);
      alert(`Has calificado el post con ${score} estrellas.`);
    } catch (error) {
      alert("Error al calificar.");
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) return alert("Debes iniciar sesión para reportar.");
    const reason = prompt("Por favor, ingresa la razón del reporte:");
    if (!reason) return;

    try {
      await postsService.createReport(post.id, reason);
      alert("Publicación reportada correctamente.");
    } catch (error) {
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
          <button onClick={() => handleRate(5)}>Calificar 5⭐</button>
          <button onClick={handleReport} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
            Reportar
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;