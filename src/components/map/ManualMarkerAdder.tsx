
import { useState } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';

interface ManualMarkerAdderProps {
  onAddMarker: (item: UnifiedItem) => void;
  defaultId?: string;
}

export const ManualMarkerAdder = ({ onAddMarker, defaultId }: ManualMarkerAdderProps) => {
  const [formData, setFormData] = useState({
    id: defaultId || '',
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    type: 'event' as 'event' | 'news' | 'business' | 'local-service',
    address: '',
    location: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }

    const newItem: UnifiedItem = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      latitude: lat,
      longitude: lng,
      type: formData.type,
      address: formData.address,
      location: formData.location,
      category: formData.category
    };

    onAddMarker(newItem);
    console.log('Added manual marker:', newItem);
    
    // Reset form
    setFormData({
      id: '',
      title: '',
      description: '',
      latitude: '',
      longitude: '',
      type: 'event',
      address: '',
      location: '',
      category: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3">Add Manual Marker</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="ID (optional)"
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Title *"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            required
          />
        </div>
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="any"
            placeholder="Latitude *"
            value={formData.latitude}
            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude *"
            value={formData.longitude}
            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as any})}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="event">Event</option>
            <option value="news">News</option>
            <option value="business">Business</option>
            <option value="local-service">Local Service</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="px-3 py-2 border rounded text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Marker to Map
        </button>
      </form>
    </div>
  );
};
