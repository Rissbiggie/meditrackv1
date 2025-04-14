import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeoLocationError {
  code: number;
  message: string;
}

interface GeoLocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

interface UseLocationResult {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  getCurrentLocation: () => Promise<{ latitude: number; longitude: number; } | null>;
}

export function useLocation(): UseLocationResult {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const options: GeoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000, // 15 seconds
    maximumAge: 0
  };

  const onSuccess = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setError(null);
    setIsLoading(false);
  };

  const onError = (error: GeoLocationError) => {
    setError(error.message);
    setIsLoading(false);
    toast({
      title: "Location Error",
      description: `Failed to get your location: ${error.message}`,
      variant: "destructive",
    });
  };

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number; } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: "Please enable location access in your browser settings",
          variant: "destructive",
        });
        resolve(null);
        return;
      }

      setIsLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setError(null);
          setIsLoading(false);
          resolve({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
          setIsLoading(false);
          toast({
            title: "Location Error",
            description: `Failed to get your location: ${error.message}`,
            variant: "destructive",
          });
          resolve(null);
        },
        options
      );
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    // Check if we have permission first
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        setError("Location access denied. Please enable it in your browser settings.");
        setIsLoading(false);
        toast({
          title: "Location Access Required",
          description: "Please enable location access to use this feature",
          variant: "destructive",
        });
        return;
      }
      
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    });
  }, []);

  return { latitude, longitude, error, isLoading, getCurrentLocation };
}

// Fake estimate distance between two points
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
