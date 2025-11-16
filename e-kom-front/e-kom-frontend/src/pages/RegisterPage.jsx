// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/Auth/RegisterForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { login } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crear una cuenta</h1>
        <p className="auth-subtitle">Regístrate para empezar a publicar</p>

        <RegisterForm onSuccess={login} />

        <p className="auth-switch">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
