import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb, isPocketBaseEnabled } from '../services/pocketbase';

const AssetContext = createContext();

export function useAssets() {
  return useContext(AssetContext);
}

export function AssetProvider({ children }) {
  const [assets, setAssets] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    if (!isPocketBaseEnabled) {
      setLoading(false);
      return;
    }
    
    try {
      const records = await pb.collection('website_assets').getFullList();
      const assetMap = {};
      
      records.forEach(record => {
        if (record.image) {
          // Construct the pocketbase URL for the file
          const url = pb.files.getUrl(record, record.image);
          assetMap[record.key] = url;
        }
      });
      
      setAssets(assetMap);
    } catch (err) {
      console.error('Failed to fetch website assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Helper to get an asset URL or fallback to default
  const getAsset = (key, defaultUrl) => {
    return assets[key] || defaultUrl;
  };

  return (
    <AssetContext.Provider value={{ assets, getAsset, fetchAssets, loading }}>
      {children}
    </AssetContext.Provider>
  );
}
