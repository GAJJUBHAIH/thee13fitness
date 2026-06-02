import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchTokens();
    }
  }, [currentUser, navigate]);

  const fetchTokens = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/admin/tokens`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTokens(data);
      }
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (type) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    window.open(`${apiUrl}/admin/reports/${type}`, '_blank');
  };

  const filteredTokens = tokens.filter(t => 
    t.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-dark-900 text-white p-6 pt-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-primary-500">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => handleDownloadReport('daily')}
              className="bg-dark-800 hover:bg-dark-700 border border-dark-600 text-white px-4 py-2 rounded transition-colors"
            >
              Download Daily Report
            </button>
            <button 
              onClick={() => handleDownloadReport('monthly')}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded transition-colors"
            >
              Download Monthly Report
            </button>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-xl">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Search by Token ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 bg-dark-900 text-white border border-dark-600 rounded-lg p-3 focus:outline-none focus:border-primary-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-600 text-gray-400">
                    <th className="p-3">Token ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Item</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.length === 0 ? (
                    <tr><td colSpan="6" className="p-4 text-center text-gray-500">No tokens found.</td></tr>
                  ) : (
                    filteredTokens.map((token, i) => (
                      <tr key={i} className="border-b border-dark-700 hover:bg-dark-700/50 transition-colors">
                        <td className="p-3 font-mono text-primary-400">{token.tokenId}</td>
                        <td className="p-3">{token.user?.name}</td>
                        <td className="p-3">{token.itemName}</td>
                        <td className="p-3 capitalize">{token.type}</td>
                        <td className="p-3">{new Date(token.purchaseDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${token.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                            {token.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
