import api from './api';

export const productService = {
  getProducts: () => api.get('/products'),
  
  getProduct: (id) => api.get(`/products/${id}`),
  
  addProduct: (productData) => api.post('/products', productData),
  
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  getRecipeSuggestion: () => api.post('/products/recipe'),
};