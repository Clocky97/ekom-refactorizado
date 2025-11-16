// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { profileService } from "../api/profile.service.js";
import { postsService } from "../api/posts.service";
import PostCard from "../components/Posts/PostCard";
import { useNavigate } from "react-router-dom";
import './ProfilePage.css'

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [tab, setTab] = useState('overview');
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      // fetch average rating for current user's posts
      try {
        const avg = await profileService.getUserAverageRating(data?.user?.id || data?.id || (data?.user_id));
        setAverageRating(avg?.average ?? 0);
      } catch (e) {
        setAverageRating(0);
      }
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
    setLoading(false);
  };

useEffect(() => {
  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      setAvatarError(false);
    } catch (err) {
      console.error("Error cargando perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

// Ensure average rating is also loaded when component mounts (for current user)
useEffect(() => {
  const loadAverage = async () => {
    try {
      const me = await profileService.getMyProfile();
      const id = me?.user?.id || me?.id || me?.user_id;
      if (id) {
        try {
          const avgRes = await profileService.getUserAverageRating(id);
          setAverageRating(avgRes?.average ?? 0);
        } catch (e) {
          console.warn('Error fetching average rating for current user', e);
          setAverageRating(0);
        }
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.warn('Could not fetch /me for average rating', err);
      setAverageRating(0);
    }
  };

  loadAverage();
}, []);

useEffect(() => {
  const loadMyPosts = async () => {
    try {
      const all = await postsService.getAllPosts();
      const uid = user?.id;
      const mine = all.filter(p => String(p.user_id) === String(uid) || (p.user && String(p.user.id) === String(uid)));
      setMyPosts(mine);
    } catch (err) {
      console.error('Error cargando mis publicaciones', err);
    }
  };

  loadMyPosts();
}, [user]);


  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "var(--text)",
        }}
      >
        Cargando tu perfil…
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Layout: profile card + content */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: '0 0 320px' }}>
          <div className="profile-card">
        {/* FOTO (placeholder si no hay user.img) */}
        <div className="profile-avatar">
          <div className="profile-avatar-circle">
            {(() => {
              // Check for avatar in multiple locations
              const avatar = 
                profile?.avatar || 
                profile?.image || 
                user?.profile?.avatar ||
                user?.avatar || 
                user?.image;
              
              // If we have an avatar URL and it hasn't failed loading, show it
              if (avatar && !avatarError) {
                return (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="profile-avatar-img"
                    onError={() => setAvatarError(true)}
                  />
                );
              }

              // Otherwise show initial
              return (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  {profile?.name?.charAt(0)?.toUpperCase() ||
                  user?.username?.charAt(0)?.toUpperCase() ||
                  "?"}
                </span>
              );
            })()}
          </div>
        </div>

        {/* NOMBRE */}
        <h1 className="profile-name">
          {profile?.name || user.username}
        </h1>

        <p className="profile-username">@{user.username}</p>

        {/* Average rating (confiabilidad) */}
        <div style={{ marginTop: '6px', marginBottom: '6px' }}>
          <strong>Confiabilidad:</strong>{' '}
          {averageRating === null ? (
            <span style={{ color: '#666' }}>cargando...</span>
          ) : (
            <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>
              {averageRating} ⭐
            </span>
          )}
        </div>

        {/* INFO */}
        <div className="profile-info">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong>{" "}
            {user.role === "admin" ? "Administrador" : "Usuario"}
          </p>

          {profile?.location && (
            <p>
              <strong>Ubicación:</strong> {profile.location}
            </p>
          )}

          {profile?.bio && (
            <p style={{ marginTop: "0.5rem" }}>
              <strong>Biografía:</strong> <br />
              <span className="profile-bio">{profile.bio}</span>
            </p>
          )}
        </div>

        {/* ACCIONES */}
        <div className="profile-buttons">
          <button
            className="btn"
            style={{ width: "100%" }}
            onClick={() => navigate("/edit-profile")}
          >
            Editar perfil
          </button>

          <button
            className="btn-outline"
            onClick={logout}
            style={{ width: "100%" }}
          >
            Cerrar sesión
          </button>
        </div>
        </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            <button className={`btn ${tab === 'overview' ? '' : 'btn-outline'}`} onClick={() => setTab('overview')}>Resumen</button>
            <button className={`btn ${tab === 'posts' ? '' : 'btn-outline'}`} onClick={() => setTab('posts')}>Mis publicaciones</button>
          </div>

          <div>
            {tab === 'overview' && (
              <div>
                <h3>Sobre mí</h3>
                <p>Revisa tu información y estadísticas aquí.</p>
              </div>
            )}

            {tab === 'posts' && (
              <div>
                <h3>Mis publicaciones</h3>
                {myPosts.length === 0 ? (
                  <p>No tienes publicaciones aún.</p>
                ) : (
                  myPosts.map(p => (
                    <div key={p.id} style={{ marginBottom: 12 }}>
                      <PostCard post={p} onDelete={(id) => setMyPosts(prev => prev.filter(x => x.id !== id))} onUpdate={(id) => window.location.href = `/edit-post/${id}`} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
