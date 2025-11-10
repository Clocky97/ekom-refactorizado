import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import AppRouter from './Router/AppRouter.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Header from './components/Common/Header.jsx';
import './App.css';

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