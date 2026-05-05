import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { Destination } from './types';
import { Star, MapPin } from 'lucide-react';

// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map view changes
const MapEffect = ({ destinations }: { destinations: Destination[] }) => {
  const map = useMap();

  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = L.latLngBounds(destinations.map(d => [d.latitude, d.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [destinations, map]);

  return null;
};

const CoastalIcon = L.divIcon({
  className: 'custom-coastal-icon',
  html: `
    <div class="w-8 h-8 bg-charcoal rounded-full border-4 border-sun shadow-lg flex items-center justify-center transition-transform hover:scale-110">
      <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface DestinationMapProps {
  destinations: Destination[];
  onSelect: (dest: Destination) => void;
}

const DestinationMap = ({ destinations, onSelect }: DestinationMapProps) => {
  // Center of Belitung/Bangka area
  const center: [number, number] = [-2.7, 107.7]; 

  return (
    <div className="w-full h-full min-h-[600px] rounded-[2.5rem] overflow-hidden shadow-inner border border-charcoal/5 relative">
      <MapContainer 
        center={center} 
        zoom={9} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEffect destinations={destinations} />
        {destinations.map(dest => (
          <Marker 
            key={dest.id} 
            position={[dest.latitude, dest.longitude]}
            icon={CoastalIcon}
          >
            <Popup className="custom-popup">
              <div 
                className="w-48 cursor-pointer group"
                onClick={() => onSelect(dest)}
              >
                <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                  <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <div className="absolute bottom-1 left-2 text-white font-serif font-bold text-xs">{dest.name}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-sage-dark">
                    <Star size={10} fill="currentColor" /> {dest.rating}
                  </div>
                  <div className="text-[10px] text-charcoal-light font-medium flex items-center gap-0.5">
                    <MapPin size={8} /> {dest.region.split(' ')[0]}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DestinationMap;
