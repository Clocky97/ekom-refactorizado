// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { profileService } from "../api/profile.service.js";
import { useNavigate } from "react-router-dom";
import './ProfilePage.css'

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
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
      {/* CARD PRINCIPAL */}
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
  );
};

export default ProfilePage;
