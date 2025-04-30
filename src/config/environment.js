// Environment configuration
export const ENV = {
  isProduction: process.env.VERCEL || process.env.NODE_ENV === 'production',
  apiBaseUrl: process.env.VERCEL 
    ? '/api/proxy'  // Use proxy in production/Vercel
    : 'https://api.fun.xyz/v1/asset/erc20/price', // Direct in development
  apiKey: process.env.API_KEY
}; 