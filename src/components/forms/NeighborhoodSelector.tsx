
import { Label } from '@/components/ui/label';

interface NeighborhoodSelectorProps {
  neighborhoods: string[];
  onNeighborhoodToggle: (neighborhood: string) => void;
}

const NeighborhoodSelector = ({ neighborhoods, onNeighborhoodToggle }: NeighborhoodSelectorProps) => {
  const neighborhoodOptions = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'back-bay', label: 'Back Bay' },
    { value: 'north-end', label: 'North End' },
    { value: 'cambridge', label: 'Cambridge' },
    { value: 'somerville', label: 'Somerville' },
    { value: 'beacon-hill', label: 'Beacon Hill' },
    { value: 'south-end', label: 'South End' },
    { value: 'fenway', label: 'Fenway' },
  ];

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 mb-3 block">
        Neighborhoods
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {neighborhoodOptions.map((neighborhood) => (
          <div key={neighborhood.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={neighborhood.value}
              checked={neighborhoods.includes(neighborhood.value)}
              onChange={() => onNeighborhoodToggle(neighborhood.value)}
              className="rounded border-purple-200 text-purple-600 focus:ring-purple-500"
            />
            <Label 
              htmlFor={neighborhood.value} 
              className="text-sm text-gray-600 cursor-pointer"
            >
              {neighborhood.label}
            </Label>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Select neighborhoods where this event is relevant
      </p>
    </div>
  );
};

export default NeighborhoodSelector;
