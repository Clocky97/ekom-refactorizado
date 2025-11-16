// src/pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/Auth/LoginForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Bienvenido de nuevo a E-Kom</p>

        <LoginForm onSuccess={login} />

        <p className="auth-switch">
          ¿No tienes cuenta?{" "}
          <a href="/register">Crear una cuenta</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
