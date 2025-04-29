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

[Application URL goes here]

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

2. **Debounced Search Implementation**
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
src/
├── components/
│ ├── TokenConverter.jsx # Main conversion interface
│ ├── TokenSelectModal.jsx # Token selection modal
│ └── PriceDisplay.jsx # Price display component
├── hooks/
│ └── useTokens.js # Token data management
├── services/
│ └── tokenService.js # API interaction layer
└── utils/
└── formatting.js # Utility functions


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