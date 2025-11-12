import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { postsService } from '../../api/posts.service.js';
import { entitiesService } from '../../api/entities.service.js';
import api from '../../api/api.js';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const isOwner = isAuthenticated && (user.id === post.user_id || user.role === 'admin');

  const [averageRating, setAverageRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

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

  // Si no tenemos el nombre del mercado en el post, intentamos resolverlo por ID
  useEffect(() => {
    const resolveMarketName = async () => {
      if (post.market_name) return; // Si ya tenemos market_name, no hacer nada
      if (!post.market_id) return;
      try {
        const markets = await entitiesService.getAllMarkets();
        const found = markets.find(m => String(m.id) === String(post.market_id));
        if (found) {
          // Actualizamos localmente la propiedad para mostrarla
          post.market_name = found.name;
        }
      } catch (err) {
        console.error('No se pudo resolver nombre del mercado:', err);
      }
    };
    resolveMarketName();
  }, [post]);

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

  const serverBase = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/ekom\/?$/, '') : '';

  return (
    <div className="post-card">
      <div className="flex items-center justify-between space-x-4">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Post image */}
          {post.image ? (
            <img src={`${serverBase}${post.image}`} alt="product" style={{ width: 84, height: 84, borderRadius: 8, objectFit: 'cover' }} />
          ) : null}

          <div>
            <h3 className="text-lg font-semibold text-slate-800">{post.title}</h3>
            <div className="text-xs text-slate-500">
              Por <strong>{post.user_name || post.user?.profile?.name || post.user?.username || 'Unknown'}</strong>
              {' · '}
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : post.created_at ? new Date(post.created_at).toLocaleString() : ''}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* Social links */}
          {post.social?.facebook && (
            <a href={post.social.facebook} target="_blank" rel="noreferrer" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.1h-1.08c-1.06 0-1.39.66-1.39 1.33v1.6h2.36l-.38 2.9h-1.98v7A10 10 0 0022 12z"/></svg>
            </a>
          )}
          {post.social?.instagram && (
            <a href={post.social.instagram} target="_blank" rel="noreferrer" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm6.4-.7a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
            </a>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600">{post.content}</p>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
        <div>
          <p><strong>Precio:</strong> ${post.price}</p>
          <p><strong>Marca:</strong> {post.brand}</p>
          <p><strong>Local:</strong> {post.market_name || 'Desconocido'}</p>
          <p><strong>Categoría:</strong> {post.category_name || 'Sin categoría'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">Calificación:</p>
          <p className="text-xl font-medium">{averageRating.toFixed(2)} ⭐</p>
        </div>
      </div>

      {isOwner && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => onUpdate(post.id)} className="px-3 py-1 bg-amber-500 text-white rounded-md">Editar</button>
          <button onClick={() => onDelete(post.id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Eliminar</button>
        </div>
      )}
      
      {isAuthenticated && !isOwner && (
        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => setShowRatingModal(true)} className="px-3 py-1 bg-amber-400 text-white rounded-md">Calificar</button>
          <button onClick={handleReport} className="px-3 py-1 bg-red-600 text-white rounded-md">Reportar</button>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px]">
            <h4 className="text-lg font-semibold mb-3">Calificar esta publicación</h4>
            <div className="flex justify-center gap-2 mb-4">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setSelectedRating(n)} className={`text-2xl ${n <= selectedRating ? 'text-yellow-400' : 'text-slate-300'}`}>
                  ★
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => { setShowRatingModal(false); setSelectedRating(0); }} className="px-3 py-1 border rounded-md">Cancelar</button>
              <button onClick={async () => { await handleRate(selectedRating); setShowRatingModal(false); setSelectedRating(0); }} className="px-3 py-1 bg-amber-500 text-white rounded-md">Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;