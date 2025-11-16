// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { profileService } from "../api/profile.service.js";
import ProfileForm from "../components/Profile/ProfileForm.jsx";

const EditProfilePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    // Esperar a que el AuthContext termine de cargar
    if (!loading) {
      loadProfile();
    }
  }, [loading]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile(); // 👈 sin params
      setProfile(data);
    } catch (err) {
      console.error("Error cargando perfil para edición:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Cargando perfil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        No se pudo cargar tu perfil.
      </div>
    );
  }

  return (
    <div>
      <ProfileForm
        profileData={profile}
        onSave={() => (window.location.href = "/profile")}
        onCancel={() => (window.location.href = "/profile")}
      />
    </div>
  );
};

export default EditProfilePage;
