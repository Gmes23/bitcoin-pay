import { allowedTokens } from '../data/allowedTokens';

// Get unique tokens by symbol (taking the first occurrence)
const getUniqueTokens = () => {
  const uniqueTokens = new Map();
  allowedTokens.forEach(token => {
    if (!uniqueTokens.has(token.symbol)) {
      uniqueTokens.set(token.symbol, token);
    }
  });
  return Array.from(uniqueTokens.values());
};

// Get the top 25 tokens based on a simple priority system
export const getTop25Tokens = () => {
  // Priority tokens that should always be included
  const prioritySymbols = ['ETH', 'WBTC', 'LINK', '1INCH', 'MATIC'];
  
  // Get the priority tokens first
  const priorityTokens = prioritySymbols.map(symbol => 
    allowedTokens.find(token => token.symbol === symbol)
  ).filter(Boolean);

  // Get all remaining tokens that aren't in the priority list
  const remainingTokens = allowedTokens.filter(token => 
    !prioritySymbols.includes(token.symbol)
  );

  // Shuffle the remaining tokens
  const shuffledTokens = [...remainingTokens]
    .sort(() => Math.random() - 0.5);

  // Combine priority tokens with random tokens to make up 25 total
  const result = [
    ...priorityTokens,
    ...shuffledTokens.slice(0, 25 - priorityTokens.length)
  ];

  return result;
};

// Search tokens based on symbol or name
export const searchTokens = (searchTerm) => {
  if (!searchTerm) return getTop25Tokens();
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return allowedTokens.filter(token => 
    token.symbol.toLowerCase().includes(normalizedSearch) ||
    token.name.toLowerCase().includes(normalizedSearch)
  );
};

// Get token by symbol and chain ID
export const getTokenBySymbolAndChain = (symbol, chainId) => {
  return allowedTokens.find(token => 
    token.symbol.toLowerCase() === symbol.toLowerCase() && 
    token.chainId === chainId
  );
};

// Get all tokens for a specific chain
export const getTokensByChain = (chainId) => {
  return allowedTokens.filter(token => token.chainId === chainId);
};

// Get token image URL (you may need to modify this based on your token image source)
export const getTokenImageUrl = (token) => {
  // Example using CoinGecko's format - replace with your actual token image source
  return `https://assets.coingecko.com/coins/images/${token.coingeckoId}/thumb/${token.symbol.toLowerCase()}.png`;
};

// Fallback token icon URL
export const getDefaultTokenIcon = () => {
  return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
};

// Format token balance with appropriate decimals
export const formatTokenBalance = (balance, decimals = 18) => {
  if (!balance) return '0';
  const divisor = Math.pow(10, decimals);
  const formattedBalance = (Number(balance) / divisor).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
  return formattedBalance;
};

// Get chain name from chainId
export const getChainName = (chainId) => {
  const chainNames = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
  };
  
  return chainNames[chainId] || 'Unknown Chain';
};

// Validate token address
export const isValidTokenAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Check if a token is in the allowed list
export const isTokenAllowed = (address, chainId) => {
  return allowedTokens.some(token => 
    token.address.toLowerCase() === address.toLowerCase() && 
    token.chainId === chainId
  );
};

// Get token details by address and chainId
export const getTokenDetails = (address, chainId) => {
  return allowedTokens.find(token => 
    token.address.toLowerCase() === address.toLowerCase() && 
    token.chainId === chainId
  );
}; 