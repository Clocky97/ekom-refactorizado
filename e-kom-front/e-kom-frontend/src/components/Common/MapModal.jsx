import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MapModal = ({ isOpen, marketName, marketLocation, onClose, triggerRef }) => {
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && marketLocation) {
      setIsLoading(true);
      // Use OpenStreetMap's Nominatim for geocoding (free, no API key needed)
      const encodedAddress = encodeURIComponent(`${marketName}, ${marketLocation}`);
      
      // Use OpenStreetMap Nominatim to get coordinates
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            // Create iframe URL pointing to OpenStreetMap with marker
            const iframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lon)-0.01},${Number(lat)-0.01},${Number(lon)+0.01},${Number(lat)+0.01}&layer=mapnik&marker=${lat},${lon}`;
            setMapEmbedUrl(iframeUrl);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error geocoding address:', err);
          setIsLoading(false);
        });
    }
  }, [isOpen, marketLocation, marketName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
          
          {/* Popover */}
          <motion.div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--primary-light)',
            }}
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>📍 {marketName}</h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text)',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--primary-light)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                ✕
              </button>
            </div>

            {/* Address info */}
            <p style={{ 
              marginBottom: '1rem', 
              color: 'var(--text)', 
              fontSize: '0.9rem',
              padding: '0.8rem',
              backgroundColor: 'var(--primary-light)',
              borderRadius: '8px',
              margin: '0 0 1rem 0'
            }}>
              <strong>Dirección:</strong> {marketLocation}
            </p>

            {/* Loading state */}
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text)' }}>Cargando mapa...</p>
              </div>
            )}

            {/* Map Embed */}
            {!isLoading && mapEmbedUrl && (
              <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', flex: 1, minHeight: '300px' }}>
                <iframe
                  title={`Map of ${marketName}`}
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={mapEmbedUrl}
                  style={{ borderRadius: '8px' }}
                ></iframe>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginTop: 'auto' }}>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${marketName}, ${marketLocation}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ 
                  textDecoration: 'none', 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  fontSize: '0.9rem',
                }}
              >
                Abrir en Maps
              </a>
              <button
                onClick={onClose}
                className="btn-outline"
                style={{ flex: 1, fontSize: '0.9rem' }}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MapModal;
