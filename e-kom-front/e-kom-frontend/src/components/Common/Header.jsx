import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Construimos la URL completa del avatar
  const avatarUrl = user?.profile?.avatar
    ? `http://localhost:1212${user.profile.avatar}`
    : null;

  return (
    <header className="bg-white shadow sticky top-0 z-20">
      <nav className="relative w-full h-16 flex items-center px-6">

        {/* 🔹 IZQUIERDA — pegado al borde */}
        <div className="flex items-center gap-4 absolute left-0 pl-6">
          <Link to="/" className="text-lg font-semibold text-slate-800">
            Inicio
          </Link>

          {isAuthenticated && (
            <Link
              to="/create-post"
              className="text-sm px-2 py-1 rounded-md bg-emerald-100 text-emerald-800"
            >
              Crear Publicación
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/categories"
              className="text-sm px-2 py-1 rounded-md bg-slate-100 text-slate-800"
            >
              Panel Admin
            </Link>
          )}
        </div>

        {/* 🔸 CENTRO — exactamente centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold tracking-wide text-slate-800 select-none">
            E-KOM
          </h1>
        </div>

        {/* 🔹 DERECHA — pegado al borde */}
        <div className="flex items-center gap-3 absolute right-0 pr-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-700 hover:text-slate-900"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className="ml-2 px-3 py-1 bg-sky-600 text-white rounded-md"
              >
                Crear Cuenta
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
              >
                {/* ✅ Imagen de perfil pequeña y visible */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="rounded-full object-cover border border-slate-300 relative top-[2px]"
                    style={{
                      width: '28px',
                      height: '28px',
                      minWidth: '28px',
                      minHeight: '28px',
                      maxWidth: '28px',
                      maxHeight: '28px',
                    }}
                  />
                ) : (
                  <div
                    className="rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-medium text-slate-600 border border-slate-300 relative top-[2px]"
                    style={{
                      width: '28px',
                      height: '28px',
                      minWidth: '28px',
                      minHeight: '28px',
                      maxWidth: '28px',
                      maxHeight: '28px',
                    }}
                  >
                    {((user?.profile?.name || user?.username || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                    ).toUpperCase()}
                  </div>
                )}


                <span className="ml-1 font-medium whitespace-nowrap">
                  {user?.profile?.name || user?.username || 'Perfil'}
                </span>
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
