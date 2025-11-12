import api from './api';

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await api.get('/product');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/product', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar un producto
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/product/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};