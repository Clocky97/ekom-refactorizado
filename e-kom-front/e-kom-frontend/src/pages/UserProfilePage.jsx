// src/pages/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profileService } from "../api/profile.service.js";
import './ProfilePage.css'

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // Obtener perfil del usuario por ID
        const profileData = await profileService.getProfileById(userId);
        setProfile(profileData);

        // Si existe user en la respuesta, obtenerlo
        if (profileData.user) {
          setUser(profileData.user);
        }
        // Obtener promedio de ratings de todos sus posts
        try {
          const avgRes = await profileService.getUserAverageRating(userId);
          setAverageRating(avgRes?.average ?? 0);
        } catch (err) {
          console.warn('No se pudo obtener average rating del usuario', err);
          setAverageRating(0);
        }

        setAvatarError(false);
      } catch (err) {
        console.error("Error cargando perfil del usuario:", err);
        setError("No se pudo cargar el perfil del usuario");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "var(--text)",
        }}
      >
        Cargando perfil…
      </div>
    );
  }

  if (error || !profile || !user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p style={{ color: "var(--error)", textAlign: "center" }}>
            {error || "Usuario no encontrado"}
          </p>
          <button
            className="btn"
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* CARD PRINCIPAL */}
      <div className="profile-card">
        {/* FOTO */}
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

        {/* Average rating */}
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

        {/* ACCIONES (solo botón volver) */}
        <div className="profile-buttons">
          <button
            className="btn"
            style={{ width: "100%" }}
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
