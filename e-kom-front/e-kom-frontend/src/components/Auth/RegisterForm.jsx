import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    lastname: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await register(formData);
      alert(response.message); 
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Crear Cuenta</h2>
          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input id="name" type="text" name="name" onChange={handleChange} required placeholder="Tu nombre" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-slate-700">Apellido</label>
              <input id="lastname" type="text" name="lastname" onChange={handleChange} required placeholder="Tu apellido" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">Nombre de usuario</label>
              <input id="username" type="text" name="username" onChange={handleChange} required placeholder="usuario123" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input id="email" type="email" name="email" onChange={handleChange} required placeholder="tu@email.com" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
              <input id="password" type="password" name="password" onChange={handleChange} required placeholder="••••••••" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>

            <div>
              <button type="submit" className="w-full py-2 px-4 bg-sky-600 text-white rounded-md hover:bg-sky-700">Crear Cuenta</button>
            </div>
          </form>

          <div className="mt-4 text-sm text-slate-600">¿Ya tienes una cuenta? <Link to="/login" className="text-sky-600">Inicia sesión aquí</Link></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;