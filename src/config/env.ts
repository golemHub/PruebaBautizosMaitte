// Configuración de variables de entorno
export const ENV_CONFIG = {
  // Backend API
  BACKEND_URL: import.meta.env.PUBLIC_BACKEND_URL || 'https://bautizosmaitte-backend.onrender.com',
  
  // reCAPTCHA
  RECAPTCHA_SITE_KEY: import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  
  // Formspree
  FORMSPREE_ENDPOINT: import.meta.env.PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xnndygjn',
  
  // Ventipay
  VENTIPAY_API_URL: import.meta.env.PUBLIC_VENTIPAY_API_URL || 'https://api.ventipay.com',
  
  // Entorno
  NODE_ENV: import.meta.env.DEV ? 'development' : 'production',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};

// Función para obtener la URL completa del backend
export const getBackendUrl = (endpoint: string = ''): string => {
  const baseUrl = ENV_CONFIG.BACKEND_URL.replace(/\/$/, ''); // Remover barra final si existe
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover barra inicial si existe
  return `${baseUrl}/${cleanEndpoint}`;
};

// Función para obtener la URL de la API de productos
export const getProductsApiUrl = (): string => {
  return getBackendUrl('/api/products');
};

// Función para obtener la URL de la API de categorías
export const getCategoriesApiUrl = (): string => {
  return getBackendUrl('/api/categories');
};

// Función para obtener la URL de la API de marcas
export const getBrandsApiUrl = (): string => {
  return getBackendUrl('/api/brands');
};

// Función para obtener la URL de la API de ventas
export const getSalesApiUrl = (): string => {
  return getBackendUrl('/api/sale');
};

// Validar configuración en desarrollo
if (import.meta.env.DEV) {
  // Configuración validada en desarrollo
}
