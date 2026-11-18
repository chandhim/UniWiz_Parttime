// Central backend configuration.
// Set REACT_APP_API_URL at build time (e.g. https://api.example.com/api) to point the app at another backend.
export const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://uniwiz-backend.test/api').replace(/\/+$/, '');
