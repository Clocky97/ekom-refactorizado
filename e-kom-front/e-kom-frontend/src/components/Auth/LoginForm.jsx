import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Iniciar Sesión</h2>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>

            <div>
              <button type="submit" className="w-full py-2 px-4 bg-sky-600 text-white rounded-md hover:bg-sky-700">Iniciar Sesión</button>
            </div>
          </form>

          <div className="mt-4 text-sm text-slate-600">¿No tienes una cuenta? <Link to="/register" className="text-sky-600">Regístrate aquí</Link></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;