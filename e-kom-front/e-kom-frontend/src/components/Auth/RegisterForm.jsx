// src/components/Auth/RegisterForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
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
      alert(res.message || "Registro exitoso.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse.");
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
