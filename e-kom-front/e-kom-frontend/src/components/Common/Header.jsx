import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useState } from "react";
import CartSidebar from "../Common/CartSidebar.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-title">
        E-KOM
      </Link>

      {/* Navegación */}
      <nav className="navbar-links">

        {/* Crear post */}
        {user && (
          <Link to="/create-post" className="btn">
            Crear publicación
          </Link>
        )}

        {/* Carrito */}
        <button className="btn" onClick={() => setCartOpen(true)}>
          Guardados ({cart.length})
        </button>

        {/* Panel admin */}
        {user?.role === "admin" && (
          <Link to="/admin/categories" className="btn-outline">
            Admin
          </Link>
        )}

        {/* Sidebar del carrito */}
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Autenticación */}
        {user ? (
          <>
            <Link to="/profile" className="btn-outline">
              Perfil
            </Link>
            <button onClick={logout} className="btn-outline">
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-outline">
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
