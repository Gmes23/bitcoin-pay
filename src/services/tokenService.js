// To be added later, removed for now
import { TOKEN_LOGOS } from '../constants/tokens';
import { getDefaultTokenIcon } from '../utils/tokenUtils';
import { API_KEY } from '../config/api';
import { getAssetPriceInfo } from '@funkit/api-base';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple rate limiting for Funkit API
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

const rateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await wait(RATE_LIMIT_DELAY - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();
};

// Detailed logging function
const logApiRequest = (requestType, params) => {
  console.log('\n=== API Request Details ===');
  console.log('Type:', requestType);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Parameters:', JSON.stringify(params, null, 2));
};

const logApiResponse = (requestType, response, error = null) => {
  console.log('\n=== API Response Details ===');
  console.log('Type:', requestType);
  console.log('Timestamp:', new Date().toISOString());
  if (error) {
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  } else {
    console.log('Response:', JSON.stringify(response, null, 2));
  }
};

// Helper to determine if we're running in production (Vercel)
const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

// Function to fetch price through proxy (for production/Vercel)
async function fetchPriceProxy(chainId, address) {
  try {
    const response = await fetch(`/api/proxy?chainId=${chainId}&address=${address}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching price through proxy:', error);
    throw error;
  }
}

// Function to fetch price directly (for local development)
async function fetchPriceDirect(chainId, address) {
  try {
    return await getAssetPriceInfo({
      chainId: String(chainId),
      assetTokenAddress: address,
      apiKey: API_KEY
    });
  } catch (error) {
    console.error('Error fetching price directly:', error);
    throw error;
  }
}

// Main function that decides which method to use
export async function fetchTokenPrices(tokens) {
  const results = {};
  const batchSize = 10;
  let lastRequestTime = 0;

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    
    for (const token of batch) {
      try {
        // Ensure 1 second between requests
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
        }

        // Choose fetch method based on environment
        const result = isProduction
          ? await fetchPriceProxy(token.chainId, token.address)
          : await fetchPriceDirect(token.chainId, token.address);

        if (result?.total) {
          results[token.symbol] = parseFloat(result.total);
        }

        lastRequestTime = Date.now();
      } catch (error) {
        console.warn(`Failed to fetch price for ${token.symbol}:`, error);
        results[token.symbol] = null;
      }
    }
  }

  return results;
}

export const sortTokensByPopularity = (tokens, popularTokens) => {
  return [...tokens].sort((a, b) => {
    const aIndex = popularTokens.indexOf(a.symbol);
    const bIndex = popularTokens.indexOf(b.symbol);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}; 