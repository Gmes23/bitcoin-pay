import React, { useState } from 'react';
import { TokenConverter } from './components/TokenConverter';

export default function App() {
  const [currentPage, setCurrentPage] = useState('converter');

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Navigation */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex justify-between w-full px-8">
              <div className="flex-shrink-0 flex items-center -ml-6">
                <span className="text-2xl font-bold text-black">Fun.xyz</span>
              </div>
              <div className="hidden sm:flex sm:space-x-8 items-center">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`${currentPage === 'home' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setCurrentPage('converter')}
                  className={`${currentPage === 'converter' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Token Converter
                </button>
                <button 
                  onClick={() => setCurrentPage('markets')}
                  className={`${currentPage === 'markets' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Markets
                </button>
                <button 
                  onClick={() => setCurrentPage('account')}
                  className={`${currentPage === 'account' ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        {currentPage === 'converter' && <TokenConverter />}
        {/* Add other page components here */}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <p className="text-gray-500 text-sm">© 2025 Fun.xyz. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Support</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
