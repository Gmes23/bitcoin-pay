// apiExamples.js

import {
    getAssetPriceInfo,
    getAssetErc20ByChainAndSymbol,
    getAllWalletTokens,
    getAllWalletTokensByChainId,
    getAllowedAssets,
    getAllWalletNFTs,
    getAllWalletNFTsByChainId,
    getWalletLidoWithdrawalsByChainId,
    getNftName,
    getNftAddress
  } from '@funkit/api-base';
  
  const API_KEY = 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk';
  
  // Example 1: Get the price of a token
  async function fetchTokenPrice() {
    const result = await getAssetPriceInfo({
      chainId: '42161',
      assetTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // USDC address
      apiKey: API_KEY
    });
    console.log('Price Info:', result);
  }
  
  // Example 2: Get ERC20 token info by symbol
  async function fetchTokenInfo() {
    const result = await getAssetErc20ByChainAndSymbol({
      chainId: '8453',
      symbol: 'ETH',
      apiKey: API_KEY
    });
    console.log('Arbitrium test:', result);
  }
  
  // Example 3: Get all tokens held by a wallet
  async function fetchWalletTokens() {
    const result = await getAllWalletTokens({
      walletAddress: '0xYourWalletAddress',
      onlyVerifiedTokens: true,
      apiKey: API_KEY
    });
    console.log('Wallet Tokens:', result);
  }
  
  // Example 4: Get tokens by wallet and chain
  async function fetchWalletTokensByChain() {
    const result = await getAllWalletTokensByChainId({
      chainId: '1',
      walletAddress: '0xYourWalletAddress',
      onlyVerifiedTokens: true,
      apiKey: API_KEY
    });
    console.log('Wallet Tokens by Chain:', result);
  }
  
  // Example 5: Get allowed checkout assets
  async function fetchAllowedAssets() {
    const result = await getAllowedAssets({
      apiKey: API_KEY
    });
    console.log('Allowed Assets:', result);
  }
  
  // Example 6: Get NFTs owned by a wallet
  async function fetchWalletNFTs() {
    const result = await getAllWalletNFTs({
      walletAddress: '0xYourWalletAddress',
      apiKey: API_KEY
    });
    console.log('Wallet NFTs:', result);
  }
  
  // Example 7: Get NFTs owned by a wallet on a chain
  async function fetchWalletNFTsByChain() {
    const result = await getAllWalletNFTsByChainId({
      chainId: '1',
      walletAddress: '0xYourWalletAddress',
      apiKey: API_KEY
    });
    console.log('Wallet NFTs by Chain:', result);
  }
  
  // Example 8: Get lido withdrawal request IDs for a wallet
  async function fetchWalletLidoWithdrawals() {
    const result = await getWalletLidoWithdrawalsByChainId({
      chainId: '1',
      walletAddress: '0xYourWalletAddress',
      apiKey: API_KEY
    });
    console.log('Lido Withdrawals:', result);
  }
  
  // Example 9: Get NFT Collection Name
  async function fetchNftName() {
    const result = await getNftName({
      chainId: '1',
      nftAddress: '0xYourNftContractAddress',
      apiKey: API_KEY
    });
    console.log('NFT Name:', result);
  }
  
  // Example 10: Get NFT Collection Address by Name
  async function fetchNftAddress() {
    const result = await getNftAddress({
      name: 'Cool NFT Collection',
      apiKey: API_KEY
    });
    console.log('NFT Address:', result);
  }
  
  // Usage
  fetchTokenPrice();
  fetchTokenInfo();
  fetchWalletTokens();
  fetchWalletTokensByChain();
  fetchAllowedAssets();
  fetchWalletNFTs();
  fetchWalletNFTsByChain();
  fetchWalletLidoWithdrawals();
  fetchNftName();
  fetchNftAddress();
  