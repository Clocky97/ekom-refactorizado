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
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 12 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 16 }}>
        {/* Avatar */}
        <div style={{ flex: '0 0 auto' }}>
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" style={{ width: 120, height: 120, borderRadius: 9999, objectFit: 'cover', border: '4px solid #f3e8ff', boxShadow: '0 6px 18px rgba(99,102,241,0.12)' }} />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: 9999, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#422', fontWeight: 700 }}>
              {((profile.name || profile.user?.username || 'U').split(' ').map(n => n[0]).slice(0,2).join('')).toUpperCase()}
            </div>
          )}
        </div>

        {/* Header info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{profile.name} {profile.lastname}</h2>
              <div style={{ color: '#6b7280', marginTop: 6 }}>{profile.user?.username || ''}</div>
            </div>
            <div style={{ marginTop: -8 }}>
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ 
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s'
                }} 
                title="Editar perfil"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                Editar perfil
              </button>
            </div>
          </div>
          <p style={{ marginTop: 12, color: '#374151' }}>{profile.bio || 'Sin biografía'}</p>
        </div>
      </div>

      {/* Details card */}
      <div style={{ background: '#ffffff', borderRadius: 12, padding: 20, border: '1px solid #eef2ff', boxShadow: '0 6px 18px rgba(2,6,23,0.03)' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '6px 0' }}><strong></strong> {profile.user?.email}</p>
            <p style={{ margin: '6px 0' }}><strong></strong> {profile.user?.role}</p>
            <p style={{ margin: '6px 0' }}><strong>Fecha de registro:</strong> {profile.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : '—'}</p>
          </div>
          <div style={{ width: 160, textAlign: 'center' }}>
            {/* Social icons placeholders */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 6 }}>
              <a href="#" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: '#eef2ff', color: '#2563eb', textDecoration: 'none' }}>f</a>
              <a href="#" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: '#fff0f6', color: '#db2777', textDecoration: 'none' }}>ig</a>
              <a href="#" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: '#f0f9ff', color: '#0369a1', textDecoration: 'none' }}>in</a>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div style={{ marginTop: 18 }}>
          <ProfileForm 
            profileData={profile} 
            onSave={fetchProfile} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;