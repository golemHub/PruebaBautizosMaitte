import { ENV_CONFIG } from './env';

// Configuración de reCAPTCHA
export const RECAPTCHA_CONFIG = {
  // Clave de sitio (desde variables de entorno o fallback)
  SITE_KEY: ENV_CONFIG.RECAPTCHA_SITE_KEY,
  
  // Configuración adicional
  THEME: 'light' as const,
  SIZE: 'normal' as const,
  TYPE: 'image' as const,
};

// Función para obtener la clave según el entorno
export const getRecaptchaSiteKey = (): string => {
  return RECAPTCHA_CONFIG.SITE_KEY;
};
