// src/components/Auth/LoginForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email: form.email, password: form.password });
      showToast("Inicio de sesión correcto.", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Error al iniciar sesión.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
        Iniciar sesión
      </button>
    </form>
  );
}
