import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { TokenSelectModal } from './TokenSelectModal';
import { useTokens } from '../hooks/useTokens';
import { allowedTokens } from '../data/allowedTokens';

export const TokenConverter = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [sourceToken, setSourceToken] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const { tokenPrices, loading, fetchTokenPrice } = useTokens();

  // Memoize prices
  const sourcePrice = useMemo(() => 
    tokenPrices[sourceToken?.symbol] || 0,
    [tokenPrices, sourceToken?.symbol]
  );

  const targetPrice = useMemo(() => 
    tokenPrices[targetToken?.symbol] || 0,
    [tokenPrices, targetToken?.symbol]
  );

  // Memoize amounts
  const sourceAmount = useMemo(() => {
    if (!usdAmount || !sourcePrice) return '0.00000';
    const value = parseFloat(usdAmount) / sourcePrice;
    return isNaN(value) ? '0.00000' : value.toFixed(5);
  }, [usdAmount, sourcePrice]);

  const targetAmount = useMemo(() => {
    if (!usdAmount || !targetPrice) return '0.00000';
    const value = parseFloat(usdAmount) / targetPrice;
    return isNaN(value) ? '0.00000' : value.toFixed(5);
  }, [usdAmount, targetPrice]);

  // Set initial tokens and fetch their prices
  useEffect(() => {
    const initializeTokens = async () => {
      // Find ETH token on Ethereum mainnet
      const initialSourceToken = allowedTokens.find(
        token => token.symbol === 'ETH' && token.chainId === 1
      );
      // Find USDT token on Ethereum mainnet
      const initialTargetToken = allowedTokens.find(
        token => token.symbol === 'USDT' && token.chainId === 1
      );

      if (initialSourceToken && initialTargetToken) {
        setSourceToken(initialSourceToken);
        setTargetToken(initialTargetToken);
        
        // Fetch prices for both tokens
        await Promise.all([
          fetchTokenPrice(initialSourceToken),
          fetchTokenPrice(initialTargetToken)
        ]);
      }
    };

    initializeTokens();
  }, []);

  const handleUsdAmountChange = (value) => {
    setUsdAmount(value);
  };

  const handleSourceTokenChange = async (token) => {
    setSourceToken(token);
    if (!tokenPrices[token.symbol]) {
      await fetchTokenPrice(token);
    }
  };

  const handleTargetTokenChange = async (token) => {
    setTargetToken(token);
    if (!tokenPrices[token.symbol]) {
      await fetchTokenPrice(token);
    }
  };

  return (
    <div className="pt-24">
      <h1 className="text-4xl font-bold text-black text-center mb-3">Token Price Explorer</h1>
      <p className="text-gray-600 text-center mb-18">Type the amount, pick your tokens, watch the magic happen — no bridges, no stress.</p>
      
      <div className="bg-[#f9f9f9] rounded-3xl shadow-sm border border-gray-200 p-1 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-0">
          {/* USD card */}
          <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-2xl p-10 relative">
            <label className="absolute top-2 left-4 text-gray-600 font-medium text_gray_smooth px-2 py-2">Amount in USD</label>
            <div className="flex items-center justify-between p-1 mt-6 h-[64px]">
              <div className="relative flex items-center w-full">
                <div className="absolute left-4 flex items-center h-full" style={{ marginLeft: '-2.5rem' }}>
                  <span className="text-gray-400/70 mr-2" style={{ 
                    fontSize: usdAmount && usdAmount.length > 8 ? 
                      usdAmount.length > 12 ? '1.5rem' : '1.875rem' 
                      : '2.25rem'
                  }}>$</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter amount"
                  value={usdAmount}
                  onChange={(e) => handleUsdAmountChange(e.target.value)}
                  className="w-full pl-2 pr-4 py-3 border-0 font-semibold text-gray-900 focus:outline-none transition-all duration-200 h-full"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: usdAmount && usdAmount.length > 8 ? 
                      usdAmount.length > 12 ? '1.5rem' : '1.875rem' 
                      : '2.25rem'
                  }}
                />
              </div>
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl ml-4 absolute top-0 right-0 mt-2 mr-2">
                <span>USD</span>
              </div>
            </div>
          </div>

          {/* ≈ */}
          <div className="relative z-10 -mx-5.5 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-[#f9f9f9] flex items-center justify-center">
              <span className="text-black text-xl font-bold">≈</span>
            </div>
          </div>

          {/* From card */}
          <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-2xl p-10 relative">
            <label className="absolute top-2 left-4 text-gray-600 font-medium text_gray_smooth px-2 py-2">From</label>
            <div className="flex items-center justify-between p-1 mt-6 h-[64px]">
              <input
                type="text"
                value={sourceAmount}
                readOnly
                className="w-full px-4 py-3 border-0 font-semibold text-gray-900 focus:outline-none transition-all duration-200 h-full"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: sourceAmount && sourceAmount.length > 8 ? 
                    sourceAmount.length > 12 ? '1.5rem' : '1.875rem' 
                    : '2.25rem'
                }}
              />
              <div 
                className="flex items-center bg-gray-100 px-4 py-2 rounded-xl cursor-pointer ml-4 absolute top-0 right-0 mt-2 mr-2"
                onClick={() => setShowSourceModal(true)}
              >
                <span className="mr-2">{sourceToken?.symbol || 'Select'}</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* → */}
          <div className="relative z-10 -mx-5.5 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-[#f9f9f9] flex items-center justify-center">
              <ArrowRight size={20} className="text-black" />
            </div>
          </div>

          {/* To card */}
          <div className="flex-1 min-w-0 bg-white border border-gray-100 rounded-2xl p-10 relative">
            <label className="absolute top-2 left-4 text-gray-600 font-medium text_gray_smooth px-2 py-2">To</label>
            <div className="flex items-center justify-between p-1 mt-6 h-[64px]">
              <input
                type="text"
                value={targetAmount}
                readOnly
                className="w-full px-4 py-3 border-0 font-semibold text-gray-900 focus:outline-none transition-all duration-200 h-full"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: targetAmount && targetAmount.length > 8 ? 
                    targetAmount.length > 12 ? '1.5rem' : '1.875rem' 
                    : '2.25rem'
                }}
              />
              <div 
                className="flex items-center bg-gray-100 px-4 py-2 rounded-xl cursor-pointer ml-4 absolute top-0 right-0 mt-2 mr-2"
                onClick={() => setShowTargetModal(true)}
              >
                <span className="mr-2">{targetToken?.symbol || 'Select'}</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 w-full max-w-5xl mx-auto bg-white p-5 rounded-xl border border-gray-200 text-sm text-gray-700">
        {sourceToken && targetToken && (
          <>
            <p>1 {sourceToken.symbol} = ${sourcePrice?.toFixed(2) || 'Loading...'}</p>
            <p>1 {targetToken.symbol} = ${targetPrice?.toFixed(2) || 'Loading...'}</p>
            <p className="mt-2">slippage 0.5% • gas $6.12 (Fast)</p>
          </>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-lg w-[333px]"
          style={{ cursor: 'pointer' }}
        >
          Complete Checkout
        </button>
      </div>

      <TokenSelectModal
        open={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        onSelect={handleSourceTokenChange}
      />
      <TokenSelectModal
        open={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        onSelect={handleTargetTokenChange}
      />
    </div>
  );
}; 