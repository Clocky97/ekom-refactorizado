import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Common/Header.jsx';

// Páginas
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import HomePage from '../pages/HomePage.jsx';
import CreatePostPage from '../pages/CreatePostPage.jsx';

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
      <div className="admin-content">
        <aside className="sidebar">
          <h2>Panel de Administración</h2>
          <nav>
            <a href="/admin/categories">Categorías</a>
            <a href="/admin/markets">Locales/Comercios</a>
            <a href="/admin/products">Productos</a>
            <div className="report-section">
              <ReportNotificationModal />
              <span>Reportes</span>
            </div>
          </nav>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// 🚀 Rutas principales
const AppRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/create-post" element={<ProtectedRoute element={<CreatePostPage />} />} />

      {/* Panel de administrador */}
      <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
        {/* Categorías */}
        <Route path="categories" element={<CategoryAdminPage />} />

        {/* Mercados */}
        <Route path="markets" element={<MarketAdminPage />} />

  {/* 🆕 Productos */}
  <Route path="products" element={<ProductAdminPage />} />
  <Route path="products/new" element={<ProductFormPage />} />
  <Route path="products/edit/:id" element={<ProductFormPage />} />

  {/* Reportes */}
  <Route path="reports" element={<ReportAdminPage />} />

  <Route path="*" element={<div>Selecciona una opción del panel.</div>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 | Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRouter;
