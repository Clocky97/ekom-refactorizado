import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import HomePage from '../pages/HomePage.jsx';
import CreatePostPage from '../pages/CreatePostPage.jsx';
import CategoryAdminPage from '../pages/admin/CategoryAdminPage.jsx'; 
import MarketAdminPage from '../pages/admin/MarketAdminPage.jsx';

// Componente para proteger RUTAS DE ADMINISTRADOR
const AdminRoute = ({ element }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>; 
  
  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to="/" replace state={{ message: "Acceso denegado: solo para administradores" }} />;
  }

  return element;
};

// Componente para proteger RUTAS DE USUARIO LOGUEADO
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Componente Layout de Admin para añadir navegación lateral
const AdminLayout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <aside style={{ width: '200px', padding: '20px', borderRight: '1px solid #ccc' }}>
                <h3>Panel Admin</h3>
                <nav>
                    <p><a href="/admin/categories">Categorías</a></p>
                    <p><a href="/admin/markets">Locales/Comercios</a></p>
                    <p>Productos (TODO)</p>
                    <p>Reportes (TODO)</p>
                </nav>
            </aside>
            <section style={{ flexGrow: 1, padding: '20px' }}>
                <Outlet />
            </section>
        </div>
    );
};


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
  <Route path="/create-post" element={<ProtectedRoute element={<CreatePostPage />} />} />
      
      <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
        <Route path="categories" element={<CategoryAdminPage />} />
        <Route path="markets" element={<MarketAdminPage />} />
        <Route path="*" element={<div>Selecciona una opción del panel.</div>} />
      </Route>

      <Route path="*" element={<div>404 | Página no encontrada</div>} />
    </Routes>
  );
};

export default AppRouter;