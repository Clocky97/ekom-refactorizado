import React, { useState, useEffect } from 'react';
import { profileService } from '../../api/profile.service';

const ProfileForm = ({ profileData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    bio: '',
    avatar: '',
    avatarFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        lastname: profileData.lastname || '',
        bio: profileData.bio || '',
        avatar: profileData.avatar || '',
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData(prev => ({ ...prev, avatarFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const profileId = profileData.id; 
      // If the user selected a file, send multipart/form-data
      if (formData.avatarFile) {
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('lastname', formData.lastname);
        fd.append('bio', formData.bio || '');
        // append the file under field name 'avatar' (backend expects this)
        fd.append('avatar', formData.avatarFile);
        await profileService.updateProfile(profileId, fd);
      } else {
        // send JSON with optional avatar URL
        await profileService.updateProfile(profileId, {
          name: formData.name,
          lastname: formData.lastname,
          bio: formData.bio,
          avatar: formData.avatar || ''
        });
      }
      alert('Perfil actualizado con éxito.');
      onSave();
    } catch (err) {
      console.error("Error al actualizar perfil:", err.response?.data);
      const errorMsg = err.response?.data?.error || 'Error al actualizar el perfil.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) return <div>Cargando datos del perfil...</div>;

  return (
    <div style={{ border: '1px solid #007bff', padding: '20px', margin: '20px' }}>
      <h3>Editar Perfil</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required /><br />
        <input type="text" name="lastname" placeholder="Apellido" value={formData.lastname} onChange={handleChange} required /><br />
        <textarea name="bio" placeholder="Biografía" value={formData.bio} onChange={handleChange}></textarea><br />
  <input type="url" name="avatar" placeholder="URL del Avatar" value={formData.avatar} onChange={handleChange} /><br />
  <label style={{ display: 'block', marginTop: 8 }}>Subir foto de perfil</label>
  <input type="file" name="avatarFile" accept="image/*" onChange={handleFileChange} /><br />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancelar</button>
      </form>
    </div>
  );
};

export default ProfileForm;