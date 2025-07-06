
import { useRef } from 'react';

interface MapContainerProps {
  height: string;
  children: React.ReactNode;
}

export const MapContainer = ({ height, children }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">      
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden relative" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />
        {children}
      </div>
    </div>
  );
};

export const useMapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  return { mapRef };
};
