import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { postsService } from '../../api/posts.service.js';
import { entitiesService } from '../../api/entities.service.js';
import api from '../../api/api.js';
import { useCart } from '../../context/CartContext.jsx';

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

  useEffect(() => {
    const resolveMarketName = async () => {
      if (post.market_name) return;
      if (!post.market_id) return;
      try {
        const markets = await entitiesService.getAllMarkets();
        const found = markets.find(m => String(m.id) === String(post.market_id));
        if (found) post.market_name = found.name;
      } catch (err) {
        console.error('No se pudo resolver nombre del mercado:', err);
      }
    };
    resolveMarketName();
  }, [post]);

  const handleRate = async (score) => {
    if (!isAuthenticated) return alert("Debes iniciar sesión para calificar.");
    try {
      await postsService.ratePost(post.id, score);
      const newAvg = await postsService.getAverageRating(post.id);
      setAverageRating(newAvg);
      alert(`Has calificado el post con ${score} estrellas.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al calificar.');
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

  const serverBase = api.defaults.baseURL
    ? api.defaults.baseURL.replace(/\/ekom\/?$/, '')
    : '';

  const { addToCart, removeFromCart, isInCart } = useCart();

  const saved = isInCart(post.id);

  const handleToggleSave = () => {
    if (saved) {
      removeFromCart(post.id);
    } else {
      addToCart({
        ...post,
        image: post.image ? `${serverBase}${post.image}` : null,
      });
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Imagen destacada */}
      {post.image && (
        <img
          src={`${serverBase}${post.image}`}
          alt={post.title}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "0.8rem",
          }}
        />
      )}

      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--brand-800)", margin: 0 }}>
            {post.title}
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--brand-600)" }}>
            Por <strong>{post.user_name}</strong> ·{" "}
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
          </p>
        </div>

        {/* Guardar */}
        <button
          onClick={handleToggleSave}
          className="btn-outline"
          style={{ padding: "0.3rem 0.6rem" }}
        >
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
      </div>

      {/* Descripción */}
      <p style={{ marginTop: "0.6rem", lineHeight: 1.5, color: "var(--brand-700)" }}>
        {post.content}
      </p>

      {/* Info básica */}
      <div style={{ marginTop: "1rem" }}>
        <p><strong>Precio:</strong> ${post.price}</p>
        <p><strong>Marca:</strong> {post.brand}</p>
        <p><strong>Local:</strong> {post.market_name || "Desconocido"}</p>
        <p><strong>Categoría:</strong> {post.category_name}</p>
        {post.offer_name && (
          <span className="offer-tag">🎁 {post.offer_name}</span>
        )}
      </div>

      {/* Rating */}
      <div style={{ marginTop: "1rem", fontWeight: 600, color: "var(--brand-700)" }}>
        ⭐ {averageRating.toFixed(2)}
      </div>

      {/* Acciones según dueño/admin */}
      {isOwner && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button className="btn" onClick={() => onUpdate(post.id)}>Editar</button>
          <button className="btn" style={{ background: "crimson" }} onClick={() => onDelete(post.id)}>
            Eliminar
          </button>
        </div>
      )}

      {/* Acciones usuario normal */}
      {isAuthenticated && !isOwner && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button className="btn" style={{ background: "var(--accent-300)" }} onClick={() => setShowRatingModal(true)}>
            Calificar
          </button>
          <button className="btn" style={{ background: "crimson" }} onClick={handleReport}>
            Reportar
          </button>
        </div>
      )}

      {/* MODAL DE RATING */}
      <AnimatePresence>
        {showRatingModal && (
          <motion.div className="modal-backdrop">
            <motion.div className="modal">
              <h4 className="text-lg font-semibold mb-3">Calificar esta publicación</h4>

              <div className="flex justify-center gap-2 mb-4">
                {[1,2,3,4,5].map(n => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRating(n)}
                    className={`text-2xl ${n <= selectedRating ? 'text-yellow' : 'text-gray'}`}
                  >
                    ★
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between">
                <button className="btn-outline" onClick={() => { setShowRatingModal(false); setSelectedRating(0); }}>
                  Cancelar
                </button>

                <button className="btn" onClick={async () => {
                  await handleRate(selectedRating);
                  setShowRatingModal(false);
                  setSelectedRating(0);
                }}>
                  Enviar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
