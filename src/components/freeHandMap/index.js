'use client';

import {
  GoogleMap,
  Polygon,
  useLoadScript,
  Marker,
} from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = { lat: 28.6139, lng: 77.209 };

export default function FreehandMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [fences, setFences] = useState([]);

  // Load saved fences
  useEffect(() => {
    const saved = localStorage.getItem('fences');
    if (saved) {
      setFences(JSON.parse(saved));
    }
  }, []);

  const handleLoad = (map) => {
    mapRef.current = map;
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    setCurrentPath([{ lat: e.latLng.lat(), lng: e.latLng.lng() }]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    setCurrentPath((prev) => [
      ...prev,
      { lat: e.latLng.lat(), lng: e.latLng.lng() },
    ]);
  };

  const handleMouseUp = () => {
    if (currentPath.length > 2) {
      // Auto-close polygon
      const finalPath = [...currentPath, currentPath[0]];
      setFences((prev) => [...prev, finalPath]);
    }
    setCurrentPath([]);
    setDrawing(false);
  };

  const handleSave = () => {
    localStorage.setItem('fences', JSON.stringify(fences));
    alert('Fences saved to localStorage');
  };

  const handleClear = () => {
    setFences([]);
    localStorage.removeItem('fences');
  };

  const handleDeleteFence = (index) => {
    setFences((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClear} style={{ marginLeft: '10px' }}>
          Clear All
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={handleLoad}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        options={{
          draggable: !drawing,
          disableDoubleClickZoom: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Active drawing */}
        {currentPath.length > 1 && (
          <Polygon
            path={currentPath}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              clickable: false,
              editable: false,
            }}
          />
        )}

        {/* Saved fences */}
        {fences.map((fence, index) => (
          <Polygon
            key={index}
            path={fence}
            options={{
              strokeColor: '#880808',
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: '#880808',
              fillOpacity: 0.2,
              editable: true,
              draggable: false,
            }}
            onRightClick={() => handleDeleteFence(index)}
          />
        ))}
      </GoogleMap>
    </>
  );
}
