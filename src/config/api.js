// api key in env, for funkit/base
export const API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

export const FUNKIT_API_BASE_URL = 'https://api.fun.xyz';

export const PROXY_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'
  : '/api';

