import React, { useState, useEffect } from 'react';
import { pb, isPocketBaseEnabled } from '../../services/pocketbase';
import { useAssets } from '../../context/AssetContext';

export default function MediaManager() {
  const { fetchAssets } = useAssets();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Define the standard website assets we want to allow replacing
  const standardAssets = [
    { key: 'logo', label: 'Website Logo', description: 'Used in Navbar and Footer' },
    { key: 'hero_bg', label: 'Hero Background', description: 'Main background image on the homepage' },
    { key: 'trainer_babusaheb', label: 'Trainer: Babusaheb Singh', description: 'Photo for Babusaheb Singh' },
    { key: 'trainer_sorabshek', label: 'Trainer: Sorabshek', description: 'Photo for Sorabshek' },
    { key: 'trainer_gajju', label: 'Trainer: Gajju', description: 'Photo for Gajju' },
    { key: 'trainer_sneha', label: 'Trainer: Sneha', description: 'Photo for Sneha' },
    { key: 'trans_amit_before', label: 'Transformation: Amit (Before)', description: 'Before photo for Amit R.' },
    { key: 'trans_amit_after', label: 'Transformation: Amit (After)', description: 'After photo for Amit R.' },
    { key: 'trans_neha_before', label: 'Transformation: Neha (Before)', description: 'Before photo for Neha K.' },
    { key: 'trans_neha_after', label: 'Transformation: Neha (After)', description: 'After photo for Neha K.' },
    { key: 'trans_vikram_before', label: 'Transformation: Vikram (Before)', description: 'Before photo for Vikram S.' },
    { key: 'trans_vikram_after', label: 'Transformation: Vikram (After)', description: 'After photo for Vikram S.' },
  ];

  useEffect(() => {
    loadDatabaseAssets();
  }, []);

  const loadDatabaseAssets = async () => {
    if (!isPocketBaseEnabled) return setLoading(false);
    try {
      const records = await pb.collection('website_assets').getFullList();
      setAssets(records);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecordForKey = (key) => {
    return assets.find(a => a.key === key);
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    setUploading(true);
    
    try {
      const existingRecord = getRecordForKey(key);
      const formData = new FormData();
      formData.append('key', key);
      formData.append('image', file);
      
      if (existingRecord) {
        // Update existing override
        await pb.collection('website_assets').update(existingRecord.id, formData);
      } else {
        // Create new override
        await pb.collection('website_assets').create(formData);
      }
      
      // Reload everything
      await loadDatabaseAssets();
      await fetchAssets(); // update global context
      
      alert('Asset updated successfully!');
    } catch (error) {
      console.error("Error uploading asset:", error);
      alert('Failed to upload asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async (key) => {
    const existingRecord = getRecordForKey(key);
    if (!existingRecord) return;
    
    if (confirm('Are you sure you want to remove this override and use the default image?')) {
      setUploading(true);
      try {
        await pb.collection('website_assets').delete(existingRecord.id);
        await loadDatabaseAssets();
        await fetchAssets();
        alert('Reset to default successfully.');
      } catch (error) {
        console.error("Error resetting asset:", error);
        alert('Failed to reset asset.');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <div className="text-white/60 p-4">Loading media manager...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Media Manager</h2>
        <p className="text-white/60 text-sm">Upload images to override the default website photos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardAssets.map((assetDef) => {
          const record = getRecordForKey(assetDef.key);
          const currentImageUrl = record && record.image 
            ? pb.files.getUrl(record, record.image) 
            : null;

          return (
            <div key={assetDef.key} className="glass border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-neon">{assetDef.label}</h3>
                <p className="text-xs text-white/50">{assetDef.description}</p>
              </div>
              
              <div className="h-32 bg-black/40 rounded-xl flex items-center justify-center border border-dashed border-white/20 overflow-hidden relative">
                {currentImageUrl ? (
                  <img src={currentImageUrl} alt={assetDef.label} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-white/30 text-sm">Default Image Active</span>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-2">
                <div>
                  <input 
                    type="file" 
                    id={`file-${assetDef.key}`} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(assetDef.key, e.target.files[0])}
                    disabled={uploading}
                  />
                  <label 
                    htmlFor={`file-${assetDef.key}`}
                    className={`cursor-pointer px-4 py-2 bg-neon/10 hover:bg-neon/20 text-neon border border-neon/30 rounded-lg text-sm transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    Upload New
                  </label>
                </div>
                
                {record && (
                  <button 
                    onClick={() => handleReset(assetDef.key)}
                    disabled={uploading}
                    className="text-xs text-rose-400 hover:text-rose-300 px-3 py-2"
                  >
                    Reset Default
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
