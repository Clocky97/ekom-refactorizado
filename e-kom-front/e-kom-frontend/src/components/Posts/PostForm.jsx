import React, { useState, useEffect } from 'react';
import { postsService } from '../../api/posts.service.js';
import { entitiesService } from '../../api/entities.service.js';

const initialFormState = {
  title: '',
  content: '',
  price: 0,
  brand: '',
  market_id: '',
  category_id: '',
  offer_id: '', 
};

const PostForm = ({ postToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loadingEntities, setLoadingEntities] = useState(true);
  
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [marketData, categoryData] = await Promise.all([
          entitiesService.getAllMarkets(),
          entitiesService.getAllCategories(),
        ]);
        setMarkets(marketData);
        setCategories(categoryData);

        if (postToEdit) {
          setFormData({
            title: postToEdit.title || '',
            content: postToEdit.content || '',
            price: postToEdit.price || 0,
            brand: postToEdit.brand || '',
            market_id: postToEdit.market_id || (marketData.length > 0 ? marketData[0].id : ''),
            category_id: postToEdit.category_id || (categoryData.length > 0 ? categoryData[0].id : ''),
            offer_id: postToEdit.offer_id || '',
          });
        } else {
            setFormData(prev => ({
                ...prev,
                market_id: marketData.length > 0 ? marketData[0].id : '',
                category_id: categoryData.length > 0 ? categoryData[0].id : '',
            }));
        }

      } catch (err) {
        console.error("Error al cargar entidades:", err);
        setError('Error al cargar mercados o categorías.');
      } finally {
        setLoadingEntities(false);
      }
    };
    fetchEntities();
  }, [postToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name.endsWith('_id') ? Number(value) : value,
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const selectedMarket = markets.find(m => String(m.id) === String(formData.market_id));

    try {
      let resp;
      if (postToEdit) {
        const payload = {
          ...formData,
          price: Number(formData.price),
          market_id: Number(formData.market_id),
          category_id: Number(formData.category_id),
          market_name: selectedMarket ? selectedMarket.name : undefined,
        };
        if (!payload.offer_id) delete payload.offer_id;
        resp = await postsService.updatePost(postToEdit.id, payload);
        console.log('updatePost response:', resp);
        alert('Publicación actualizada con éxito.');
      } else {
        // Creation requires an image file
        if (!imageFile) {
          setError('La publicación requiere una imagen del producto.');
          setSubmitting(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('price', Number(formData.price));
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('market_id', Number(formData.market_id));
        formDataToSend.append('category_id', Number(formData.category_id));
        if (formData.offer_id) formDataToSend.append('offer_id', formData.offer_id);
        formDataToSend.append('image', imageFile);

        resp = await postsService.createPost(formDataToSend);
        console.log('createPost response:', resp);
        alert('Publicación creada con éxito.');
      }

      setFormData(initialFormState);
      setImageFile(null);
      try { onSave(); } catch (err) { console.warn('onSave callback threw:', err); }
      try { onClose(); } catch (err) { console.warn('onClose callback threw:', err); }
    } catch (err) {
      console.error('Error al guardar post:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
      setError(serverMsg || 'Error al guardar la publicación.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEntities) return <div>Cargando opciones del formulario...</div>;
  if (markets.length === 0 || categories.length === 0) return <div>No hay suficientes entidades (categorías o mercados) para crear una publicación. Crea en el panel de Admin.</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 w-full max-w-2xl my-8 shadow-2xl border border-slate-100">
        {/* Header con gradiente */}
        <div className="mb-6 pb-4 border-b-2 border-gradient bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-4">
          <h3 className="text-3xl font-bold text-white drop-shadow-lg">
            {postToEdit ? '✏️ Editar Publicación' : '🆕 Crear Nueva Publicación'}
          </h3>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>{error}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Título */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span>Título del Producto</span>
            </label>
            <input 
              type="text" 
              name="title" 
              placeholder="Ej: Leche fresca Lacteo..." 
              value={formData.title} 
              onChange={handleChange}
              required 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-blue-300 transition group-hover:shadow-md"
            />
          </div>

          {/* Contenido */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>Descripción Detallada</span>
            </label>
            <textarea 
              name="content" 
              placeholder="Describe el producto, ubicación, horarios, promociones, etc..." 
              value={formData.content} 
              onChange={handleChange}
              required 
              rows="4"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-blue-300 transition group-hover:shadow-md resize-none"
            ></textarea>
          </div>

          {/* Marca y Precio en dos columnas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-lg">🏷️</span>
                <span>Marca</span>
              </label>
              <input 
                type="text" 
                name="brand" 
                placeholder="Ej: Lacteo, Danone..." 
                value={formData.brand} 
                onChange={handleChange}
                required 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-blue-300 transition group-hover:shadow-md"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-lg">💰</span>
                <span>Precio</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-bold">$</span>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="0" 
                  value={formData.price} 
                  onChange={handleChange}
                  min="0"
                  required 
                  className="w-full px-4 py-3 pl-8 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white hover:border-green-300 transition group-hover:shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Categoría y Mercado en dos columnas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-lg">📂</span>
                <span>Categoría</span>
              </label>
              <select 
                name="category_id" 
                value={formData.category_id} 
                onChange={handleChange}
                required 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white hover:border-purple-300 transition group-hover:shadow-md cursor-pointer appearance-none text-slate-700 font-semibold"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235B21B6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="text-slate-700 font-semibold">📂 Selecciona una categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="text-slate-700 font-semibold">{c.name}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-lg">🏪</span>
                <span>Local/Comercio</span>
              </label>
              <select 
                name="market_id" 
                value={formData.market_id} 
                onChange={handleChange}
                required 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white hover:border-orange-300 transition group-hover:shadow-md cursor-pointer appearance-none text-slate-700 font-semibold"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23EA580C' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="text-slate-700 font-semibold">🏪 Selecciona un local</option>
                {markets.map(m => (
                  <option key={m.id} value={m.id} className="text-slate-700 font-semibold">{m.name} - {m.type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div className="group">
            <label className="block text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-lg">🖼️</span>
              <span>Foto del Producto</span>
              {!postToEdit && <span className="text-red-500 font-bold">*</span>}
            </label>
            <div className={`relative p-4 border-2 border-dashed rounded-lg transition cursor-pointer ${imageFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50'}`}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                required={!postToEdit} 
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0 rounded-lg"
                id="file-input"
              />
              <label htmlFor="file-input" className="flex items-center gap-3 cursor-pointer">
                {imageFile ? (
                  <>
                    <span className="text-3xl">✅</span>
                    <div>
                      <p className="font-bold text-green-600">Imagen seleccionada</p>
                      <p className="text-sm text-green-500">{imageFile.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">📸</span>
                    <div>
                      <p className="font-bold text-slate-700">Haz clic para seleccionar</p>
                      <p className="text-sm text-slate-500">o arrastra una imagen aquí</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6 justify-end border-t-2 border-slate-200">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-bold transition transform hover:scale-105 flex items-center gap-2"
            >
              <span>❌</span>
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 font-bold disabled:from-blue-300 disabled:to-blue-300 transition transform hover:scale-105 flex items-center gap-2 drop-shadow-lg"
            >
              <span>{submitting ? '⏳' : (postToEdit ? '💾' : '🚀')}</span>
              {submitting ? 'Guardando...' : (postToEdit ? 'Guardar Cambios' : 'Publicar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;