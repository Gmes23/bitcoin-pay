import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useTokens } from '../hooks/useTokens';
import { getChainName } from '../utils/tokenUtils';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const TokenSelectModal = ({ open, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [displayTokens, setDisplayTokens] = useState([]);
  const { getFilteredTokens } = useTokens();
  const debouncedSearch = useDebounce(search, 300);
  const modalRef = useRef(null);

  useEffect(() => {
    const updateTokens = () => {
      const filtered = getFilteredTokens(debouncedSearch);
      setDisplayTokens(filtered.slice(0, 25)); // Show top 25 by default
    };
    updateTokens();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgb(196, 198, 204, 0.2)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 relative"
      >
        <button className="absolute top-4 right-4 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-semibold mb-4">Select a token</h2>
        <div className="relative mb-4">
          <input
            className="w-full px-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring bg-transparent"
            placeholder="Search tokens"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="h-[320px] overflow-y-auto divide-y divide-gray-100">
          {displayTokens.length === 0 ? (
            <div className="py-3 text-gray-400 text-center h-full flex items-center justify-center">
              No tokens found
            </div>
          ) : (
            displayTokens.map(token => {
              const chainName = getChainName(token.chainId);
              return (
                <button
                  key={`${token.chainId}-${token.address}`}
                  className="w-full text-left px-3 py-3 hover:bg-gray-50 focus:bg-gray-100 rounded transition flex items-center"
                  onClick={() => { 
                    onSelect({ 
                      symbol: token.symbol, 
                      chainId: token.chainId,
                      address: token.address 
                    }); 
                    onClose(); 
                  }}
                >
                  <div>
                    <div className="font-medium">{token.symbol} <span className="text-xs text-gray-500">({chainName})</span></div>
                    <div className="text-xs text-gray-500">{token.name}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}; 