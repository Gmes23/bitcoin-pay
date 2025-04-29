import { useState } from 'react';
import { sortTokensByPopularity } from '../services/tokenService';
import { POPULAR_TOKENS } from '../constants/tokens';
import { allowedTokens } from '../data/allowedTokens';
import { getAssetPriceInfo } from '@funkit/api-base';
import { API_KEY } from '../config/api';

// Parse user input and return the matching token object from allowedTokens
export function parseTokenInput(input) {
  const search = input.trim().toLowerCase();
  return allowedTokens.find(token =>
    token.symbol.toLowerCase() === search ||
    token.name.toLowerCase() === search
  );
}

// Format the token object for the API
export function formatTokenForApi(token) {
  if (!token || !token.address || !token.chainId) return null;
  return {
    chainId: String(token.chainId),
    assetTokenAddress: token.address,
    apiKey: API_KEY
  };
}

export const useTokens = () => {
  const [tokenPrices, setTokenPrices] = useState({});
  const [loading, setLoading] = useState(false);

  // Search for tokens by symbol or name, return full token objects
  const getFilteredTokens = (searchTerm = '') => {
    const searchLower = searchTerm.toLowerCase();
    let filtered = allowedTokens;

    if (searchTerm) {
      filtered = allowedTokens.filter(token =>
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower)
      );
    }

    return sortTokensByPopularity(filtered, POPULAR_TOKENS);
  };

  // Fetch price for a single selected token
  const fetchTokenPrice = async (token) => {
    if (!token?.address || !token?.chainId) return null;
    setLoading(true);
    
    try {
      const result = await getAssetPriceInfo({
        chainId: String(token.chainId),
        assetTokenAddress: token.address,
        apiKey: API_KEY
      });
      
      if (result?.total) {
        const price = parseFloat(result.total);
        if (!isNaN(price)) {
          setTokenPrices(prev => ({
            ...prev,
            [token.symbol]: price
          }));
          return price;
        }
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch price for ${token.symbol} (${token.chainId}):`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenPrices,
    setTokenPrices,
    loading,
    getFilteredTokens,
    fetchTokenPrice,
    parseTokenInput,
    formatTokenForApi
  };
}; 