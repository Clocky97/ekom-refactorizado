import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items, setOpen } = useCart();
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-wide text-slate-800 select-none">
              E-KOM
            </h1>
            {/* Visible test: pulsing dot to confirm framer-motion is active */}
            <motion.span
              className="w-3 h-3 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              aria-hidden
            />
          </div>
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
            <div className="flex items-center gap-6">
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
                    className="rounded-full bg-slate-100 border border-slate-300 relative top-[2px]"
                    style={{
                      width: '28px',
                      height: '28px',
                      minWidth: '28px',
                      minHeight: '28px',
                      maxWidth: '28px',
                      maxHeight: '28px',
                    }}
                  />
                )}


                <span className="ml-1 font-medium whitespace-nowrap">
                  {user?.profile?.name || user?.username || 'Perfil'}
                </span>
              </Link>

              <button
                onClick={() => {
                  // Open cart in a new tab/page instead of showing the sidebar
                  try {
                    const url = `${window.location.origin}/cart`;
                    window.open(url, '_blank');
                  } catch (e) {
                    // fallback to opening just '/cart'
                    window.open('/cart', '_blank');
                  }
                }}
                className="relative text-slate-700 hover:text-slate-900 transition mr-2"
                title="Ver carrito en nueva pestaña"
              >
                <span className="text-xl">🛒</span>
                {items.length > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    key={items.length}
                  >
                    {items.length}
                  </motion.span>
                )}
              </button>

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
