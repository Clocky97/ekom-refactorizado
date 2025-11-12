// DEPRECATED: Products removed. These helpers exist to avoid import errors in admin pages.
// getProducts returns an empty array. Other operations return a rejected promise indicating removal.

export const getProducts = async () => {
  return [];
};

export const getProductById = async (id) => {
  return Promise.reject(new Error('Product resource removed'));
};

export const createProduct = async (productData) => {
  return Promise.reject(new Error('Product resource removed'));
};

export const updateProduct = async (id, productData) => {
  return Promise.reject(new Error('Product resource removed'));
};

export const deleteProduct = async (id) => {
  return Promise.reject(new Error('Product resource removed'));
};