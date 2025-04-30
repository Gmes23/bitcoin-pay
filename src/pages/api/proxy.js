// Proxy handler for Vercel deployment
export default async function handler(req, res) {
  const { chainId, address } = req.query;
  
  try {
    const response = await fetch(
      `https://api.fun.xyz/v1/asset/erc20/price/${chainId}/${address}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 