'use client';

import {
  GoogleMap,
  Polygon,
  useLoadScript,
  DrawingManager,
} from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';

const libraries = ['drawing'];
const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = { lat: 28.6139, lng: 77.209 };

export default function ClickToDrawMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [fences, setFences] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('fences');
    if (saved) {
      setFences(JSON.parse(saved));
    }
  }, []);
  const handlePolygonComplete = (polygon) => {
    const path = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

    setFences((prev) => {
      const updated = [...prev, path];
      localStorage.setItem('fences', JSON.stringify(updated));
      return updated;
    });

    polygon.setMap(null);
  };

  const handleClear = () => {
    setFences([]);
    localStorage.removeItem('fences');
  };

  const handleSave = async () => {
    await fetch('/api/fences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fences }),
    });
    alert('Saved fences!');
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='mt-12'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <DrawingManager
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ['polygon'],
            },
            polygonOptions: {
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              strokeWeight: 2,
              clickable: false,
              editable: false,
              zIndex: 1,
            },
          }}
          onPolygonComplete={handlePolygonComplete}
        />

        {fences?.map((fence, idx) => (
          <Polygon
            key={idx}
            path={fence}
            options={{
              strokeColor: '#0000FF',
              strokeOpacity: 0.6,
              strokeWeight: 2,
              fillColor: '#0000FF',
              fillOpacity: 0.2,
              editable: true,
            }}
            onMouseUp={(e) => {
              const path = e.domEvent?.target?.getPath?.().getArray?.().map((p) => ({
                lat: p.lat(),
                lng: p.lng(),
              }));
              if (path) {
                const updated = [...fences];
                updated[idx] = path;
                setFences(updated);
                localStorage.setItem('fences', JSON.stringify(updated));
              }
            }}
          />
        ))}
      </GoogleMap>
      <div className='flex gap-3 text-sm justify-end mr-4 mt-4'>
        <button onClick={handleSave} className='py-2 px-4 bg-blue-100 rounded-md cursor-pointer'>Save</button>
        <button onClick={handleClear} className='py-2 px-4 bg-red-100 rounded-md cursor-pointer'>
          Clear All
        </button>
      </div>
    </div>
  );
}
