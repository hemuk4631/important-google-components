'use client';
import React, { useRef, useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const AddressForm = () => {
  const inputRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const [formData, setFormData] = useState({
    locality: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (scriptLoaded && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ['address_components', 'formatted_address'],
          types: [
            'administrative_area_level_3',
            'locality',
            'administrative_area_level_1',
          ],
          componentRestrictions: { country: 'in' },
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components || [];
        console.log(autocomplete.getPlace());

        const getComponent = (types) => {
          const component = addressComponents.find((c) =>
            types.some((type) => c.types.includes(type))
          );
          return component ? component.long_name : '';
        };
        const getPriorityComponent = (
          primaryType: string,
          fallbackType: string = ''
        ) => {
          const primary = addressComponents.find((c) =>
            c.types.includes(primaryType)
          );
          if (primary) return primary.long_name || '';
          const fallback = addressComponents.find((c) =>
            c.types.includes(fallbackType)
          );
          if (fallback) return fallback.long_name || '';
        };
        const city = getPriorityComponent(
          'administrative_area_level_3',
          'locality'
        );
        const state = getPriorityComponent('administrative_area_level_1');
        const pincode = getPriorityComponent('postal_code');

        setFormData({
          locality: place.formatted_address || '',
          city,
          state,
          pincode,
        });
      });
    }
  }, [scriptLoaded]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      onLoad={() => setScriptLoaded(true)}
    >
      <form style={{ maxWidth: '700px', margin: '0 auto' }} className='bg-yellow-50 p-12 rounded-md border-2 border-gray-300'>
        <div>
          <label className="font-semibold">Enter Locality</label>
          <input
            type="text"
            name="locality"
            placeholder="Enter locality"
            ref={inputRef}
            value={formData.locality}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            className="border rounded-md border-gray-300 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <label className="font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              className="border rounded-md border-gray-300 bg-white"
            />
          </div>
          <div>
            <label className="font-semibold">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              className="border rounded-md border-gray-300 bg-white"
            />
          </div>
          <div>
            <label className="font-semibold">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              className="border rounded-md border-gray-300 bg-white"
            />
          </div>
        </div>
      </form>
    </LoadScript>
  );
};

export default AddressForm;
