import React, { useEffect, useState } from "react";
import { postsService } from "../api/posts.service";
import { entitiesService } from "../api/entities.service";
import PostCard from "../components/Posts/PostCard";
import { postOffersService } from "../api/postOffers.service";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "../index.css"

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [featuredOffers, setFeaturedOffers] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSeedOffers = async () => {
    try {
      await postOffersService.seedOffers();
      const fo = await postOffersService.getFeaturedOffers();
      setFeaturedOffers(fo);
      alert('Ofertas de prueba creadas. Recarga si no ves cambios.');
    } catch (err) {
      console.error(err);
      alert('No se pudieron crear ofertas de prueba: ' + (err?.message || err));
    }
  };

  const loadInitialData = async () => {
    try {
      const [p, c, m] = await Promise.all([
        postsService.getAllPosts(),
        entitiesService.getAllCategories(),
        entitiesService.getAllMarkets(),
        // featured offers fetch (non-blocking)
      ]);

      setPosts(p);
      setCategories(c);
      setMarkets(m);
      // fetch featured offers separately
      try {
        const { postOffersService } = await import('../api/postOffers.service');
        const fo = await postOffersService.getFeaturedOffers();
        setFeaturedOffers(fo);
      } catch (err) {
        console.warn('No se pudieron cargar ofertas destacadas', err);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
    setLoading(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || String(post.category_id) === String(categoryFilter);

    const matchesMarket =
      marketFilter === "" || String(post.market_id) === String(marketFilter);

    return matchesSearch && matchesCategory && matchesMarket;
  });

  return (
    <div style={{ padding: "1rem 0" }}>
      
      {/* 🔍 Buscador */}
      <div
        className="card"
        style={{
          margin: "0 auto 1rem",
          maxWidth: "700px",
          padding: "1rem 1.4rem",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className="btn-outline" onClick={handleSeedOffers} style={{ fontSize: 12 }}>
            Dev: generar ofertas
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar publicaciones…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--brand-300)",
            outline: "none",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* 🎛 Filtros */}
      <div
        className="card"
        style={{
          margin: "0 auto 1rem",
          maxWidth: "700px",
          padding: "1rem 1.4rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* Categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid var(--brand-300)",
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Mercado */}
          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid var(--brand-300)",
            }}
          >
            <option value="">Todos los locales</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FEED */}
      <div
        style={{
          margin: "0 auto",
          maxWidth: "750px",
          paddingLeft: featuredOffers.length > 0 ? "0" : "0",
          transition: "paddingLeft 0.3s ease",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>
        ) : filteredPosts.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text)" }}>
            No se encontraron publicaciones.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: "1.2rem" }}
            >
              <PostCard
                post={post}
                onDelete={(id) =>
                  setPosts((prev) => prev.filter((p) => p.id !== id))
                }
                onUpdate={(id) => (window.location.href = `/edit-post/${id}`)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* SIDEBAR OFERTAS DESTACADAS (izquierda, solo en desktop) */}
      {featuredOffers.length > 0 && (
        <div className="featured-sidebar" style={{ position: 'fixed', left: 15, top: 120, width: 240, maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="card" style={{ padding: '1rem', marginBottom: 0 }}>
            <h4 style={{ marginTop: 0, marginBottom: '0.8rem', fontSize: '1rem' }}>Ofertas</h4>
            {featuredOffers.map((o) => (
              <div key={o.id} style={{ padding: '0.4rem 0', borderBottom: '1px solid #eee', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-dark)', fontSize: '0.8rem' }}>{o.user?.username || 'U.'}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>{o.post?.title?.substring(0, 20)}...</div>
                <div style={{ color: 'var(--accent-300)', fontWeight: 700, fontSize: '0.9rem', marginTop: '2px' }}>${o.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón Crear publicación */}
      {isAuthenticated && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="btn"
            onClick={() => (window.location.href = "/create-post")}
          >
            Crear publicación
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
