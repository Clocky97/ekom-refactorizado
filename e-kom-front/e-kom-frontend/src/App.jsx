import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import './App.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin'; 

  return (
    <header>
      <nav>
        <div className="nav-left">
          <a href="/">Inicio</a>
          {isAdmin && (
            <a href="/admin/categories" className="admin-link">
              Panel Admin
            </a>
          )}
        </div>
        <div className="nav-right">
          {!isAuthenticated ? (
            <>
              <a href="/login">Iniciar Sesión</a>
              <a href="/register">Crear Cuenta</a>
            </>
          ) : (
            <>
              <a href="/profile">
                <span className="user-profile">
                  {user?.profile?.name || user?.username || 'Perfil'}
                </span>
              </a>
              <button onClick={logout} className="btn-danger">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando aplicación...</div>;
  }

  return (
    <>
      <Header />
      <main>
        <AppRouter />
      </main>
    </>
  );
}

export default App;