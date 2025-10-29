import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../api/profile.service';
import ProfileForm from '../components/Profile/ProfileForm';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await profileService.getProfileById(user.id);
      setProfile(data); 

    } catch (error) {
      console.error("Error al cargar el perfil:", error.response?.data);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  if (!isAuthenticated) return <p>Debes iniciar sesión para ver tu perfil.</p>;
  if (loading) return <div>Cargando perfil...</div>;
  if (!profile) return <div>Error: No se encontró el perfil.</div>;

  return (
    <div>
      <h1>Perfil de Usuario: {profile.user.username}</h1>
      
      <div style={{ padding: '15px', border: '1px solid #ccc' }}>
        <p><strong>Nombre:</strong> {profile.name} {profile.lastname}</p>
        <p><strong>Email:</strong> {profile.user.email}</p>
        <p><strong>Rol:</strong> {profile.user.role}</p>
        <p><strong>Biografía:</strong> {profile.bio || 'Sin biografía'}</p>
        <p><strong>Avatar:</strong> {profile.avatar ? <img src={profile.avatar} alt="Avatar" style={{ width: '50px', height: '50px' }} /> : 'No disponible'}</p>
      </div>

      <button onClick={() => setIsEditing(true)} style={{ marginTop: '20px' }}>
        Editar Perfil
      </button>

      {isEditing && (
        <ProfileForm 
          profileData={profile} 
          onSave={fetchProfile} 
          onCancel={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;