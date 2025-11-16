// src/components/Auth/RegisterForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    lastname: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register(form);
      const msg = res.message || "Registro exitoso.";
      showToast(msg, "success");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.error || "Error al registrarse.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Nombre de usuario</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn" style={{ width: "100%" }}>
        Crear Cuenta
      </button>
    </form>
  );
}
