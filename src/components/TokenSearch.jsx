import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import '../styles/TokenSearch.css';
import { getDefaultTokenIcon, getChainName } from '../utils/tokenUtils';
import { TOKEN_LOGOS } from '../constants/tokens';
import { getAssetPriceInfo } from '@funkit/api-base';
import { API_KEY } from '../config/api';
import { allowedTokens } from '../data/allowedTokens';

const TokenSearch = ({ onTokenSelect, selectedChainId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTokenPrice, setSelectedTokenPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter tokens based on chain ID and search term
  const filteredTokens = useMemo(() => {
    let tokens = allowedTokens;
    
    // Filter by chain if specified
    if (selectedChainId) {
      tokens = tokens.filter(token => token.chainId === selectedChainId);
    }
    
    // Filter by search term if present
    if (searchTerm.trim()) {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      tokens = tokens.filter(token => 
        token.symbol.toLowerCase().includes(normalizedSearch) ||
        token.name.toLowerCase().includes(normalizedSearch)
      );
    }
    
    return tokens;
  }, [selectedChainId, searchTerm]);

  // Fetch price only when a token is selected
  const fetchTokenPrice = async (token) => {
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
          setSelectedTokenPrice({
            symbol: token.symbol,
            price: price
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error(`Failed to fetch price for ${token.symbol}:`, err);
      setError(`Failed to fetch price for ${token.symbol}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="token-search-container">
      <div className="token-search-input-container">
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="token-search-input"
        />
      </div>
      
      {error && <div className="token-error">{error}</div>}
      
      <div className="token-list">
        {filteredTokens.map((token) => {
          const key = `${token.chainId}-${token.address}`;
          const chainName = getChainName(token.chainId);
          const price = selectedTokenPrice?.symbol === token.symbol ? selectedTokenPrice.price : null;
          
          return (
            <div
              key={key}
              className="token-item"
              onClick={() => {
                onTokenSelect(token);
                fetchTokenPrice(token);
              }}
            >
              <div className="token-icon">
                <img
                  src={TOKEN_LOGOS[token.symbol] || getDefaultTokenIcon()}
                  alt={token.symbol}
                  onError={(e) => e.target.src = getDefaultTokenIcon()}
                />
              </div>
              <div className="token-info">
                <div className="token-symbol-chain">
                  <span className="token-symbol">{token.symbol}</span>
                  <span className="token-chain-badge">{chainName}</span>
                </div>
                <div className="token-details">
                  <span className="token-name">{token.name}</span>
                  {price && (
                    <span className="token-price">${price.toFixed(2)}</span>
                  )}
                  {loading && token.symbol === selectedTokenPrice?.symbol && (
                    <span className="token-price-loading">Loading...</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenSearch; 