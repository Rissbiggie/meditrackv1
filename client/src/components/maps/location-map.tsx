import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: { lat: number; lng: number; title: string; icon?: string }[];
  className?: string;
}

export function LocationMap({ 
  latitude, 
  longitude, 
  zoom = 15, 
  markers = [],
  className 
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize map when component mounts
    if (!mapRef.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBniFa_mO6eSvzeS_yJi_kZLTvIwHcmpgQ'}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => {
      setMapError("Failed to load Google Maps");
      toast({
        title: "Map Error",
        description: "Failed to load Google Maps. Please check your internet connection.",
        variant: "destructive",
      });
    };
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;
      
      try {
        // Create the map instance
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: zoom,
          disableDefaultUI: true,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#242f3e" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#242f3e" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#746855" }]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [{ "color": "#263c3f" }]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#6b9a76" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#38414e" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#212a37" }]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#9ca5b3" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [{ "color": "#746855" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#1f2835" }]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#f3d19c" }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#2f3948" }]
            },
            {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#d59563" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#17263c" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#515c6d" }]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#17263c" }]
            }
          ]
        });

        // Add user location marker
        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillOpacity: 1,
            fillColor: '#EF4444',
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
          }
        });

        // Add additional markers
        markers.forEach(marker => {
          new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapInstanceRef.current,
            title: marker.title,
            icon: marker.icon,
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError("Failed to initialize map");
        toast({
          title: "Map Error",
          description: "Failed to initialize map. Please try again.",
          variant: "destructive",
        });
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [latitude, longitude, zoom, markers, toast]);

  // Update map when position changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
      } catch (error) {
        console.error('Error updating map center:', error);
      }
    }
  }, [latitude, longitude]);

  if (mapError) {
    return (
      <div className={`w-full h-full rounded-lg overflow-hidden bg-gray-800/50 flex items-center justify-center ${className || ''}`}>
        <div className="text-white/40 text-center">
          <p className="text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full rounded-lg overflow-hidden ${className || ''}`}
    />
  );
}

export default LocationMap;
