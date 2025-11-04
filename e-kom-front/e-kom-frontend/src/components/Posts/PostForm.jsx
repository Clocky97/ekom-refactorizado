import React, { useState, useEffect } from 'react';
import { postsService } from '../../api/posts.service.js';
import { entitiesService } from '../../api/entities.service.js'; 

const initialFormState = {
  title: '',
  content: '',
  price: 0,
  brand: '',
  market_id: '',
  product_id: '',
  offer_id: '', 
};

const PostForm = ({ postToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loadingEntities, setLoadingEntities] = useState(true);
  
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [marketData, productData] = await Promise.all([
          entitiesService.getAllMarkets(),
          entitiesService.getAllProducts(),
        ]);
        setMarkets(marketData);
        setProducts(productData);

        if (postToEdit) {
          setFormData({
            title: postToEdit.title || '',
            content: postToEdit.content || '',
            price: postToEdit.price || 0,
            brand: postToEdit.brand || '',
            market_id: postToEdit.market_id || (marketData.length > 0 ? marketData[0].id : ''),
            product_id: postToEdit.product_id || (productData.length > 0 ? productData[0].id : ''),
            offer_id: postToEdit.offer_id || '',
          });
        } else {
            setFormData(prev => ({
                ...prev,
                market_id: marketData.length > 0 ? marketData[0].id : '',
                product_id: productData.length > 0 ? productData[0].id : '',
            }));
        }

      } catch (err) {
        console.error("Error al cargar entidades:", err);
        setError('Error al cargar mercados o productos.');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const payload = {
        ...formData,
        price: Number(formData.price),
        market_id: Number(formData.market_id),
        product_id: Number(formData.product_id),
    };
    
    if (!payload.offer_id) {
        delete payload.offer_id;
    }

    try {
      if (postToEdit) {
        await postsService.updatePost(postToEdit.id, payload);
        alert('Publicación actualizada con éxito.');
      } else {
        await postsService.createPost(payload);
        alert('Publicación creada con éxito.');
      }
      onSave(); 
      onClose(); 
    } catch (err) {
      console.error("Error al guardar post:", err.response?.data);
      console.log(err)
      setError(err.response?.data?.message || 'Error al guardar la publicación.');
    }
  };

  if (loadingEntities) return <div>Cargando opciones del formulario...</div>;
  if (markets.length === 0 || products.length === 0) return <div>No hay suficientes entidades (productos o mercados) para crear una publicación. Crea en el panel de Admin.</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid blue', margin: '20px' }}>
      <h3>{postToEdit ? 'Editar Publicación' : 'Crear Nueva Publicación'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        
        <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleChange} required /><br />
        <textarea name="content" placeholder="Contenido (Dirección, descripción...)" value={formData.content} onChange={handleChange} required></textarea><br />
        
        <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required /><br />
        <input type="text" name="brand" placeholder="Marca" value={formData.brand} onChange={handleChange} required /><br />
        
        <label>Producto:</label>
        <select name="product_id" value={formData.product_id} onChange={handleChange} required>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.product_name} ({p.brand})</option>
          ))}
        </select><br />

        <label>Local/Comercio:</label>
        <select name="market_id" value={formData.market_id} onChange={handleChange} required>
          {markets.map(m => (
            <option key={m.id} value={m.id}>{m.name} - {m.type}</option>
          ))}
        </select><br />
        
        {/* SELECT para Ofertas (Opcional) */}
        {/* <label>Oferta asociada:</label>
        <select name="offer_id" value={formData.offer_id} onChange={handleChange}>
            <option value="">Ninguna</option>
        </select><br /> */}

        <button type="submit">
          {postToEdit ? 'Guardar Cambios' : 'Publicar'}
        </button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Cancelar</button>
      </form>
    </div>
  );
};

export default PostForm;