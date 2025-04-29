# Token Price Explorer

A modern, responsive web application for exploring and converting token prices across multiple blockchain networks. Built with React, Vite, Tailwind and powered by the Fun.xyz API.

## Features

- 🔄 Real-time token price conversion
- 🔍 Smart token search with chain-specific filtering
- ⛓️ Multi-chain support (Ethereum, Polygon, Arbitrum, Optimism)
- 💱 Support for 100+ tokens across major networks
- 🎨 Modern, responsive UI with smooth animations
- ⚡ Optimized performance with memoization and debouncing

## Live Demo

Live Demo : [https://bitcoin-pay.vercel.app/]

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- A Fun.xyz API key

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Gmes23/bitcoin-pay.git]
   cd bitcoin-pay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Fun.xyz API key:
   ```
   VITE_FUNKIT_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### State Management Strategy
We implemented a hybrid state management approach:

1. **Local Component State**
```javascript
const [selectedToken, setSelectedToken] = useState(null);
const [inputAmount, setInputAmount] = useState('');
```
This pattern is used for UI-specific states where:
- The data is confined to a single component
- The state updates are frequent (e.g., input changes)
- The data doesn't need to be shared across multiple components

2. **Centralized Data Management**
```javascript
const useTokens = () => {
  const [tokenPrices, setTokenPrices] = useState({});
  const [loading, setLoading] = useState({});
  
  const fetchTokenPrice = async (tokenAddress, chainId) => {
    // Implementation details
  };
  
  return { tokenPrices, loading, fetchTokenPrice };
};
```
This custom hook serves as the central data manager, handling:
- Token price fetching and caching
- Loading states per token
- Error handling and retry logic
- Rate limiting (1 request per second to prevent API throttling)

### Performance Optimizations

1. **Memoization Strategy**
```javascript
const filteredTokens = useMemo(() => {
  return tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 25);
}, [tokens, searchTerm]);
```
Applied in scenarios where:
- Computations are expensive (e.g., filtering large token lists)
- Dependencies change infrequently
- Memory trade-off is justified by performance gains

Here is an example of how we used memoization to optimize the conversion calculations instead of using useState which would have caused unnecessary re-renders we can use memoization to cache the results of the calculations and only recalculate when the dependencies change

```javascript
// Price memoization
const sourcePrice = useMemo(() => 
  tokenPrices[sourceToken?.symbol] || 0,
  [tokenPrices, sourceToken?.symbol]
);

// Amount calculations
const sourceAmount = useMemo(() => {
  if (!usdAmount || !sourcePrice) return '0.00000';
  const value = parseFloat(usdAmount) / sourcePrice;
  return isNaN(value) ? '0.00000' : value.toFixed(5);
}, [usdAmount, sourcePrice]);
```

2. **Debounced Search Implementation**
    When a user types "ETH", the debounced search implementation will trigger 1 search ("ETH") instead of 3 searches ("E", "ET", "ETH")

```javascript
const debouncedSearch = useCallback(
  debounce((term) => {
    setSearchTerm(term);
  }, 300),
  []
);
```
Optimizes search performance by:
- Reducing unnecessary re-renders
- Minimizing API calls
- Improving UI responsiveness

## Token Identification System

### The Challenge
While the Fun.xyz API provides powerful token price functionality, it requires specific chain IDs and token addresses for each request. However, users typically think in terms of token symbols (like "ETH" or "USDT") rather than addresses and chain IDs. This presents a usability challenge: how do we translate user-friendly token searches into API-compatible requests?

### Our Solution
We implemented a token to symbol mapping system that allows users to search for tokens by symbol and get the correct token data from the API.

1. **Pre-compiled Token Database**
```javascript
// Example from allowedTokens.jsx
const allowedTokens = [
  { 
    chainId: 1,  // Ethereum Mainnet
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    name: "Ethereum"
  },
  { 
    chainId: 137,  // Polygon
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    symbol: "WETH",
    name: "Wrapped Ether (Polygon)"
  }
  // ... other tokens
];
```

2. **Smart Token Search**
```javascript
const getFilteredTokens = (searchTerm = '') => {
    const searchLower = searchTerm.toLowerCase();
    return allowedTokens.filter(token =>
        token.symbol.toLowerCase().includes(searchLower) ||
        token.name.toLowerCase().includes(searchLower)
    );
};
```

### Key Features

1. **Cross-Chain Symbol Resolution**
   - Same symbols across different chains are properly differentiated
   - Each token maintains its unique chain ID and contract address
   - Users can search by both symbol and full name

2. **API Integration Layer**
   - Automatically maps user selections to correct API parameters
   - Handles chain-specific token addresses
   - Maintains consistent token identification across the application

3. **User Experience Benefits**
   - Simple symbol-based search for users
   - Behind-the-scenes handling of complex chain and address data
   - No technical knowledge required for token selection

### Implementation Details

1. **Token Data Structure**
   - Chain ID: Identifies the blockchain network
   - Contract Address: Unique token identifier on that chain
   - Symbol: Common trading symbol (e.g., "ETH")
   - Name: Full token name for clarity

2. **Search and Selection Flow**
   ```javascript
   // User searches for "ETH"
   // System finds all matching tokens across chains:
   [
     { symbol: "ETH", chainId: 1, ... },     // Ethereum on Mainnet
     { symbol: "WETH", chainId: 137, ... },  // Wrapped ETH on Polygon
     // ... other matches
   ]
   ```

3. **API Request Translation**
   ```javascript
   // When user selects a token, system automatically provides:
   {
     chainId: String(token.chainId),
     assetTokenAddress: token.address,
     apiKey: API_KEY
   }
   ```

### Why This Matters

This system solves several critical challenges:
- **Usability**: Users can search naturally without knowing technical details
- **Accuracy**: Ensures correct token identification across different chains
- **Maintainability**: Centralized token data management
- **Scalability**: Easy to add new tokens and chains

### API Integration Architecture

1. **Centralized API Layer**
```javascript
// tokenService.js
const fetchTokenPrices = async (tokens) => {
  const batchSize = 10;
  const results = {};
  
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    // Batch processing implementation
  }
  
  return results;
};
```
Features:
- Batch processing to optimize network requests
- Automatic retry mechanism for failed requests
- Request rate limiting
- Comprehensive error handling
- Response caching

2. **Error Handling Strategy**
```javascript
try {
  const price = await fetchTokenPrice(address, chainId);
  setTokenPrices(prev => ({...prev, [key]: price}));
} catch (error) {
  setErrors(prev => ({...prev, [key]: error.message}));
  // Fallback mechanism implementation
}
```

### UI/UX Design Decisions

1. **Token Selection Modal**
- Limited to 25 tokens per view for optimal performance and usability
- Implements fuzzy search for both token symbols and names
- Maintains separate loading states per token
- Includes click-outside behavior for natural interaction

2. **Price Display and Conversion**
```javascript
const formattedPrice = useMemo(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
}, [price]);
```
- Dynamic decimal precision based on token value
- Immediate feedback during conversion
- Clear loading and error states

## Technical Implementation Details

### Component Structure
```
src/
├── components/
│   ├── TokenConverter.jsx      # Main conversion interface
│   ├── TokenSelectModal.jsx    # Token selection modal
│   └── PriceDisplay.jsx        # Price display component
├── hooks/
│   └── useTokens.js            # Token data management
├── services/
│   └── tokenService.js         # API interaction layer
└── utils/
    └── formatting.js           # Utility functions
```

### Data Flow Architecture
1. Initial Load:
   - Bootstrap application with default tokens (ETH, USDT)
   - Pre-fetch initial token prices
   - Initialize state containers

2. User Interaction Flow:
   - Token selection triggers price fetching
   - Amount changes trigger conversion calculations
   - Search inputs trigger filtered token list updates

3. Price Update Cycle:
   - Regular price updates (every 30 seconds)
   - On-demand updates for selected tokens
   - Cached responses for frequently accessed tokens

## Development Guidelines

### Best Practices
1. **State Management**
   - Use local state for UI-specific data
   - Implement centralized state for shared data
   - Maintain immutable state updates

2. **Performance**
   - Implement memoization for expensive calculations
   - Use debouncing for search inputs
   - Optimize component re-renders

3. **Error Handling**
   - Implement comprehensive error boundaries
   - Provide fallback UI components
   - Maintain detailed error logging

## Technical Dependencies
- React 18+
- Vite
- TailwindCSS
- Fun.xyz API Integration