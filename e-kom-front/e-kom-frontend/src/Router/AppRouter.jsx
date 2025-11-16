import React from 'react';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Common/Header.jsx';

// Páginas
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import HomePage from '../pages/HomePage.jsx';
import CreatePostPage from '../pages/CreatePostPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import EditProfilePage from "../pages/EditProfilePage.jsx"; 

// Admin pages
import CategoryAdminPage from '../pages/admin/CategoryAdminPage.jsx';
import MarketAdminPage from '../pages/admin/MarketAdminPage.jsx';
import ProductAdminPage from '../pages/Admin/ProductAdminPage.jsx';
import ProductFormPage from '../pages/Admin/ProductFormPage.jsx';
import ReportAdminPage from '../pages/Admin/ReportAdminPage.jsx';
import ReportNotificationModal from '../components/admin/ReportNotificationModal.jsx';

// 🔒 Ruta protegida para administradores
const AdminRoute = ({ element }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: 'Acceso denegado: solo para administradores' }}
      />
    );
  }

  return element;
};

// 🔒 Ruta protegida para usuarios autenticados
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// 📂 Layout del panel de administrador
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">

        <h2 className="admin-title">Panel de Administración</h2>

        <nav className="admin-nav">

          <Link to="/admin/categories" className="admin-link">
            Categorías
          </Link>

          <Link to="/admin/markets" className="admin-link">
            Locales / Comercios
          </Link>

          {/* Producto (pronto deprecado, pero lo dejo con estilo) */}
          <Link to="/admin/products" className="admin-link">
            Productos
          </Link>

          {/* Reportes con campana */}
          <div className="admin-reports">
            <ReportNotificationModal />
            <span className="admin-link">Reportes</span>
          </div>

        </nav>
      </div>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
  <Route path="/cart" element={<CartPage />} />

      {/* Rutas protegidas */}
<Route 
  path="/profile" 
  element={<ProtectedRoute element={<ProfilePage />} />} 
/>

<Route 
  path="/edit-profile" 
  element={<ProtectedRoute element={<EditProfilePage />} />} 
/>

<Route 
  path="/create-post" 
  element={<ProtectedRoute element={<CreatePostPage />} />} 
/>

      {/* Panel de administrador */}
      <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
        <Route path="categories" element={<CategoryAdminPage />} />
        <Route path="markets" element={<MarketAdminPage />} />
        <Route path="products" element={<ProductAdminPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />
        <Route path="reports" element={<ReportAdminPage />} />
        <Route path="*" element={<div>Selecciona una opción del panel.</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 | Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRouter;
