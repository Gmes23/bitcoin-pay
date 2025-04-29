# Token Price Explorer

A modern, responsive web application for exploring and converting token prices across multiple blockchain networks. Built with React and powered by the Fun.xyz API.

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

- Node.js (v16 or higher)
- npm or yarn
- A Fun.xyz API key

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
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

## Technical Stack

### Core Technologies
- **React** - UI framework
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **@funkit/api-base** - Fun.xyz API integration for token prices

### Key Dependencies
- **lucide-react** - Modern icon library
- **viem** - Ethereum interaction library
- **tailwindcss** - For responsive styling

## Architecture & Design Choices

### Component Structure
- **TokenConverter** - Main component for token conversion interface
- **TokenSelectModal** - Reusable modal for token selection
- **useTokens** - Custom hook for token management and price fetching

### Performance Optimizations
- Memoized calculations for derived values
- Debounced search input
- Efficient token filtering and sorting
- Click-outside handling for modals

### State Management
- React hooks for local state
- Memoization for computed values
- Efficient API call handling

## Notable Features

### Token Management
- Support for multiple chains (Ethereum, Polygon, Arbitrum, Optimism)
- Smart token search with symbol and name matching
- Chain-specific token filtering
- Prioritized token list with popular tokens

### Price Conversion
- Real-time price updates
- Accurate conversion calculations
- Support for various token decimals
- Clear display of conversion rates

### User Interface
- Clean, modern design
- Responsive layout
- Smooth transitions and animations
- Intuitive token selection

## Development Decisions

1. **API Integration**
   - Used Fun.xyz API for reliable token prices
   - Implemented caching for API responses
   - Added error handling and loading states

2. **Performance**
   - Removed unnecessary re-renders with useMemo
   - Implemented debounced search
   - Optimized token filtering and sorting

3. **User Experience**
   - Added clear loading indicators
   - Implemented smooth transitions
   - Provided clear error messages
   - Maintained responsive design

## Future Improvements

- Add wallet integration for direct transactions
- Implement price history charts
- Add more token networks
- Enhance error handling and recovery
- Add unit and integration tests
- Implement caching for token prices


