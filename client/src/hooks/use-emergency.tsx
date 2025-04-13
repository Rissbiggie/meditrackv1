import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/use-maps';
import { connectWebSocket, sendWSMessage, addWSListener } from '@/lib/websocket';
import { 
  EmergencyAlert, 
  InsertEmergencyAlert, 
  AmbulanceUnit,
  MedicalFacility,
  User as SelectUser
} from '@shared/schema';

interface EmergencyContextType {
  isEmergencyModalOpen: boolean;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;
  submitEmergency: (data: { emergencyType: string; description: string }) => void;
  isSubmittingEmergency: boolean;
  activeEmergencies: EmergencyAlert[] | null;
  isLoadingEmergencies: boolean;
  nearbyAmbulances: AmbulanceUnit[] | null;
  nearbyFacilities: MedicalFacility[] | null;
  userEmergencyHistory: EmergencyAlert[] | null;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const { toast } = useToast();
  const { getCurrentLocation } = useLocation();
  
  // Get current user directly from the API instead of using useAuth
  const { data: user = null } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Get active emergencies
  const {
    data: activeEmergencies = null,
    isLoading: isLoadingEmergencies,
  } = useQuery<EmergencyAlert[]>({
    queryKey: ['/api/emergencies/active'],
    enabled: !!user,
  });

  // Get nearby ambulances
  const {
    data: nearbyAmbulances = null,
  } = useQuery<AmbulanceUnit[]>({
    queryKey: ['/api/ambulances/nearby'],
    enabled: !!user,
  });

  // Get nearby medical facilities
  const {
    data: nearbyFacilities = null,
  } = useQuery<MedicalFacility[]>({
    queryKey: ['/api/facilities/nearby'],
    enabled: !!user,
  });

  // Get user emergency history
  const {
    data: userEmergencyHistory = null,
  } = useQuery<EmergencyAlert[]>({
    queryKey: ['/api/emergencies/user'],
    enabled: !!user,
  });

  // Create emergency
  const { mutate: submitEmergency, isPending: isSubmittingEmergency } = useMutation({
    mutationFn: async (data: { emergencyType: string; description: string }) => {
      if (!user) {
        throw new Error('You must be logged in to submit an emergency');
      }
      
      const locationData = await getCurrentLocation();
      if (!locationData) {
        throw new Error('Could not determine your location');
      }
      
      const emergencyData: InsertEmergencyAlert = {
        userId: user.id,
        latitude: locationData.latitude.toString(),
        longitude: locationData.longitude.toString(),
        emergencyType: data.emergencyType,
        description: data.description,
      };
      
      const res = await apiRequest('POST', '/api/emergencies', emergencyData);
      return await res.json();
    },
    onSuccess: () => {
      setIsEmergencyModalOpen(false);
      toast({
        title: "Emergency Submitted",
        description: "Help is on the way. Stay calm and wait for assistance.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergencies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emergencies/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Emergency Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const openEmergencyModal = () => setIsEmergencyModalOpen(true);
  const closeEmergencyModal = () => setIsEmergencyModalOpen(false);

  // Set up WebSocket connection and listeners
  useEffect(() => {
    // Connect to WebSocket
    connectWebSocket();

    // Set up listener for real-time updates
    const removeListener = addWSListener((data) => {
      if (data.type === 'emergency_broadcast') {
        // Invalidate queries to get fresh data
        queryClient.invalidateQueries({ queryKey: ['/api/emergencies/active'] });
        
        // Show a toast notification
        toast({
          title: "New Emergency Alert",
          description: `A new ${data.data.emergencyType} emergency has been reported.`,
        });
      }
      
      if (data.type === 'location_update') {
        // Invalidate queries for ambulances and facilities
        queryClient.invalidateQueries({ queryKey: ['/api/ambulances/nearby'] });
      }
    });

    // Clean up listener on unmount
    return () => {
      removeListener();
    };
  }, [toast]);
  
  // Send location updates if user is logged in
  useEffect(() => {
    if (!user) return;
    
    const locationInterval = setInterval(async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          sendWSMessage('location_update', {
            id: user.id,
            role: user.role,
            latitude: location.latitude,
            longitude: location.longitude
          });
        }
      } catch (error) {
        console.error('Failed to send location update:', error);
      }
    }, 30000); // Send location every 30 seconds
    
    return () => {
      clearInterval(locationInterval);
    };
  }, [user, getCurrentLocation]);

  return (
    <EmergencyContext.Provider
      value={{
        isEmergencyModalOpen,
        openEmergencyModal,
        closeEmergencyModal,
        submitEmergency,
        isSubmittingEmergency,
        activeEmergencies,
        isLoadingEmergencies,
        nearbyAmbulances,
        nearbyFacilities,
        userEmergencyHistory,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    console.error('useEmergency must be used within an EmergencyProvider');
    // Return a default context with no-op functions to prevent crashes
    return {
      isEmergencyModalOpen: false,
      openEmergencyModal: () => {},
      closeEmergencyModal: () => {},
      submitEmergency: (data: any) => {},
      isSubmittingEmergency: false,
      activeEmergencies: null,
      isLoadingEmergencies: false,
      nearbyAmbulances: null,
      nearbyFacilities: null,
      userEmergencyHistory: null
    };
  }
  return context;
}
