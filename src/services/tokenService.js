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

// tokens: {symbol_chainId: { address, chainId }}
export const fetchTokenPrices = async (tokens) => {
  try {
    const batchSize = 10;
    const prices = {};
    const entries = Object.entries(tokens);

    console.log('\n=== Starting Batch Token Price Fetch ===');
    console.log('Total tokens to fetch:', entries.length);
    console.log('Batch size:', batchSize);

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(entries.length/batchSize)}`);
      
      await Promise.all(batch.map(async ([key, { address, chainId }]) => {
        if (!address || !chainId) {
          console.warn(`Skipping token with missing address or chainId:`, key, address, chainId);
          return;
        }
        try {
          const requestParams = {
            chainId: String(chainId),
            assetTokenAddress: address,
            apiKey: API_KEY
          };
          
          logApiRequest('getAssetPriceInfo', {
            chainId: String(chainId),
            assetTokenAddress: address,
            // Mask API key in logs
            apiKey: API_KEY.substring(0, 4) + '...' + API_KEY.substring(API_KEY.length - 4)
          });

          const result = await getAssetPriceInfo(requestParams);
          logApiResponse('getAssetPriceInfo', result);
          
          if (result?.total) {
            const price = parseFloat(result.total);
            if (!isNaN(price)) {
              prices[key] = price;
              console.log(`Successfully fetched price for ${key}: ${price}`);
            }
          }
        } catch (error) {
          logApiResponse('getAssetPriceInfo', null, error);
          console.warn(`Failed to fetch price for ${key}:`, error);
        }
      }));
      await rateLimit();
    }

    console.log('\n=== Batch Token Price Fetch Complete ===');
    console.log('Successfully fetched prices:', Object.keys(prices).length);
    console.log('Failed fetches:', entries.length - Object.keys(prices).length);

    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

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