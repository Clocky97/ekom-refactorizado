import React, { useState, useEffect } from "react";
import { profileService } from "../../api/profile.service";
import "../admin/AdminStyles.css";

const ProfileForm = ({ profileData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    bio: "",
    avatar: "",
    avatarFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        lastname: profileData.lastname || "",
        bio: profileData.bio || "",
        avatar: profileData.avatar || "",
        avatarFile: null,
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatarFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const profileId = profileData.id;

      await profileService.updateProfile(profileId, {
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
      });

      if (formData.avatarFile) {
        await profileService.updateProfileAvatar(profileId, formData.avatarFile);
      }

      onSave();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el perfil.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) return <div>Cargando datos del perfil...</div>;

  return (
    <div className="profile-edit-card">
      <h2 className="profile-edit-title">Editar Perfil</h2>

      {error && <p className="profile-edit-error">{error}</p>}

      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Biografía</label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Contanos algo sobre vos..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>URL del avatar</label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://foto.com/avatar.jpg"
          />
        </div>

        <div className="form-group">
          <label>Subir nueva foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="profile-edit-buttons">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
