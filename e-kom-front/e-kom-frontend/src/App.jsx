import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppRouter from './router/AppRouter.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './App.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin'; 

  return (
    <header className="bg-white shadow sticky top-0 z-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-slate-800">Inicio</Link>
          {isAuthenticated && (
            <Link to="/create-post" className="text-sm px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">Crear Publicación</Link>
          )}
          {isAdmin && (
            <Link to="/admin/categories" className="text-sm px-2 py-1 rounded-md bg-slate-100 text-slate-800">
              Panel Admin
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm text-slate-700 hover:text-slate-900">Iniciar Sesión</Link>
              <Link to="/register" className="ml-2 px-3 py-1 bg-sky-600 text-white rounded-md">Crear Cuenta</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
                  {user?.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt="avatar"
                      className="w-5 h-5 rounded-full object-cover"
                      style={{ 
                        border: '1px solid rgba(0,0,0,0.08)',
                        maxWidth: '20px',
                        maxHeight: '20px',
                        minWidth: '20px',
                        minHeight: '20px'
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-600" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      {((user?.profile?.name || user?.username || 'U').split(' ').map(n => n[0]).slice(0,2).join('')).toUpperCase()}
                    </div>
                  )}
                  <span className="ml-1 font-medium whitespace-nowrap">{user?.profile?.name || user?.username || 'Perfil'}</span>
                </Link>
                <button onClick={logout} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md">Cerrar Sesión</button>
              </div>
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
    <ToastProvider>
      <Header />
      <main>
        <AppRouter />
      </main>
    </ToastProvider>
  );
}
export default App;