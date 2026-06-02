import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';

export default function VerifyToken() {
  const [tokenId, setTokenId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tokenId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/tokens/verify/${tokenId}`);
      const data = await response.json();

      if (data.valid) {
        setResult(data.data);
      } else {
        setError(data.error || 'Invalid Token');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[60vh] bg-dark-900 text-white flex flex-col items-center justify-center p-6 pt-32">
        <h1 className="text-4xl font-black mb-8 text-primary-500">Verify Purchase Token</h1>
        
        <form onSubmit={handleVerify} className="w-full max-w-md bg-dark-800 p-8 rounded-xl border border-dark-700 shadow-xl">
          <label className="block text-gray-400 mb-2 font-medium">Enter Token ID</label>
          <input 
            type="text" 
            placeholder="MEM-2026-XXXXXX"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value.toUpperCase())}
            className="w-full bg-dark-900 text-white border border-dark-600 rounded-lg p-3 mb-4 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Token'}
          </button>
        </form>

        {error && (
          <div className="mt-8 bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-900/50 w-full max-w-md text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 bg-dark-800 p-8 rounded-xl border border-primary-500/30 w-full max-w-md shadow-lg shadow-primary-500/10">
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Valid Token
            </h2>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-white">Name:</strong> {result.user?.name}</p>
              <p><strong className="text-white">Item:</strong> {result.itemName}</p>
              <p><strong className="text-white">Status:</strong> <span className="uppercase text-xs bg-dark-700 px-2 py-1 rounded text-primary-400">{result.status}</span></p>
              <p><strong className="text-white">Purchase Date:</strong> {new Date(result.purchaseDate).toLocaleDateString()}</p>
              {result.expiryDate && (
                <p><strong className="text-white">Expiry Date:</strong> {new Date(result.expiryDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
