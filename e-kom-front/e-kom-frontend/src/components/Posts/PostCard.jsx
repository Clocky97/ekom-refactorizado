import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { postsService } from '../../api/posts.service.js';
import { postOffersService } from '../../api/postOffers.service.js';
import { entitiesService } from '../../api/entities.service.js';
import api from '../../api/api.js';
import { useCart } from '../../context/CartContext.jsx';
import MapModal from '../Common/MapModal.jsx';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isOwner = isAuthenticated && (user.id === post.user_id || user.role === 'admin');

  const [averageRating, setAverageRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPercent, setOfferPercent] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [marketData, setMarketData] = useState(null);

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

  // Owner-only flow: owner applies percent discounts via modal

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

  const handleOpenMarketMap = async () => {
    if (!post.market_id) {
      alert('No hay mercado asociado a esta publicación');
      return;
    }

    try {
      const markets = await entitiesService.getAllMarkets();
      const found = markets.find(m => String(m.id) === String(post.market_id));
      if (found) {
        setMarketData(found);
        setShowMapModal(true);
      } else {
        alert('No se pudo encontrar la información del mercado');
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      alert('Error al cargar datos del mercado');
    }
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--primary-dark)", margin: "0 0 0.4rem 0", lineHeight: 1.3 }}>
            {post.title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--primary)", margin: "0.3rem 0 0 0", lineHeight: 1.4 }}>
            Por{" "}
            <button
              onClick={() => navigate(`/user/${post.user_id}`)}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-dark)",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {post.user_name}
            </button>
            {" "}·{" "}
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
          </p>
        </div>

        {/* Guardar */}
        <button
          onClick={handleToggleSave}
          className="btn-outline"
          style={{ padding: "0.3rem 0.6rem", height: "fit-content" }}
        >
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
      </div>

      {/* Descripción */}
      <p style={{ marginTop: "1.2rem", marginBottom: "1.2rem", lineHeight: 1.7, color: "var(--text)", fontSize: "1rem" }}>
        {post.content}
      </p>

      {/* Info básica */}
      <div style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
        <p style={{ marginBottom: "0.8rem" }}><strong>Precio:</strong> ${post.price}</p>
        <p style={{ marginBottom: "0.8rem" }}><strong>Marca:</strong> {post.brand}</p>
        <p style={{ marginBottom: "0.8rem" }}>
          <strong>Local:</strong>{" "}
          <button
            onClick={handleOpenMarketMap}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary-dark)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            {post.market_name || "Desconocido"} 📍
          </button>
        </p>
        <p style={{ marginBottom: "0.8rem" }}><strong>Categoría:</strong> {post.category_name}</p>
        {post.offer_name && (
          <span className="offer-tag" style={{ marginRight: "0.5rem" }}>🎁 {post.offer_name}</span>
        )}
        {post.custom_offer_percent && (
          <span className="offer-tag">🎯 {post.custom_offer_percent}%</span>
        )}
      </div>

      {/* Rating */}
      <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem", fontWeight: 600, color: "var(--text)", fontSize: "1.1rem" }}>
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

      {/* Owner actions: allow applying percent discount */}
      {isOwner && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <button className="btn" style={{ background: "#2a9d8f" }} onClick={() => setShowOfferModal(true)}>
            Añadir oferta (descuento %)
          </button>
          {post.custom_offer_percent && (
            <button className="btn" style={{ background: "#d9534f" }} onClick={async () => {
              if (!window.confirm('¿Seguro que deseas quitar el descuento?')) return;
              try {
                await postOffersService.removeOwnerOffer(post.id);
                alert('Descuento removido correctamente. La página se recargará.');
                window.location.reload();
              } catch (err) {
                alert(err.response?.data?.error || 'Error al remover descuento');
              }
            }}>
              Quitar oferta
            </button>
          )}
        </div>
      )}

      {/* MODAL DE OWNER OFFER (apply percent discount) */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div className="modal-backdrop">
            <motion.div className="modal">
              <h4 className="text-lg font-semibold mb-3">Aplicar descuento en esta publicación</h4>

              <div style={{ marginBottom: '1rem' }}>
                <label>Descuento (%) (1-100):</label>
                <input type="number" value={offerPercent} onChange={(e) => setOfferPercent(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }} min={1} max={100} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn-outline" onClick={() => { setShowOfferModal(false); setOfferPercent(''); }}>
                  Cancelar
                </button>

                <button className="btn" onClick={async () => {
                  const p = Number(offerPercent);
                  if (!p || p < 1 || p > 100) return alert('Ingresa un porcentaje válido entre 1 y 100');
                  try {
                    await postOffersService.applyOwnerOffer(post.id, p);
                    alert('Descuento aplicado correctamente. La página se recargará para mostrar cambios.');
                    window.location.reload();
                  } catch (err) {
                    alert(err.response?.data?.error || 'Error al aplicar descuento');
                  }
                }}>
                  Aplicar descuento
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* MAP MODAL */}
      <MapModal
        isOpen={showMapModal}
        marketName={marketData?.name || ''}
        marketLocation={marketData?.location || ''}
        onClose={() => setShowMapModal(false)}
      />
    </motion.div>
  );
};

export default PostCard;
