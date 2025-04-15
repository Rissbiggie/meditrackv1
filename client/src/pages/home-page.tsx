import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Icon } from "@/components/ui/icon";
import { Phone, MapPin, Navigation, User, UserRound, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/lib/use-toast";
import { useLocation } from "@/hooks/use-maps";
import { useLocation as useWouterLocation } from "wouter";

interface MedicalFacility {
  id: string;
  name: string;
  distanceInMiles?: number;
  openHours?: string;
}

export default function HomePage() {
  const { 
    openEmergencyModal,
    isLoadingEmergencies,
  } = useEmergency();
  const { error: showError } = useToast();
  const { getCurrentLocation } = useLocation();
  const [, setLocation] = useWouterLocation();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user's location
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        showError("Unable to get your location. Some features may be limited.");
      }
    };
    getLocation();
  }, [getCurrentLocation, showError]);

  // Query for nearby facilities
  const {
    data: nearbyFacilities,
    isLoading: isLoadingFacilities,
    error: facilitiesError
  } = useQuery<MedicalFacility[]>({
    queryKey: ["nearbyFacilities"],
    queryFn: async () => {
      const response = await fetch("/api/facilities");
      if (!response.ok) {
        throw new Error("Failed to fetch nearby facilities");
      }
      return response.json() as Promise<MedicalFacility[]>;
    },
    retry: 2,
    staleTime: 30000, // Data remains fresh for 30 seconds
  });

  useEffect(() => {
    if (facilitiesError) {
      showError("Failed to load nearby facilities. Please try again later.");
    }
  }, [facilitiesError, showError]);

  // Show loading state only for initial data fetch
  if (isLoadingEmergencies) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader />

      <main className="pt-20 px-4">
        <div className="animate-fade-in">
          {/* Emergency Assistance Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-2">Emergency Assistance</h2>
              <p className="text-white/80 text-sm mb-4">Press the button below to request immediate medical assistance</p>
              <Button 
                onClick={openEmergencyModal}
                className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-bold py-6 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#EF4444]/30 mb-2"
                disabled={isLoadingEmergencies}
              >
                <Icon name="ambulance" className="text-2xl mr-3 h-6 w-6" />
                <span className="text-xl">EMERGENCY</span>
              </Button>
              <p className="text-white/60 text-xs text-center">Your location will be shared with emergency services</p>
            </CardContent>
          </Card>

          {/* Nearby Facilities Section */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Nearby Medical Facilities</CardTitle>
              <CardDescription>Medical facilities in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingFacilities ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : nearbyFacilities && nearbyFacilities.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {nearbyFacilities.map((facility) => (
                    <Card key={facility.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{facility.name}</h4>
                          {facility.distanceInMiles && (
                            <p className="text-sm text-muted-foreground">
                              <Navigation className="h-4 w-4 inline mr-1" />
                              {facility.distanceInMiles.toFixed(1)} miles away
                            </p>
                          )}
                          {facility.openHours && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Open: {facility.openHours}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No nearby facilities found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts Quick Access */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Emergency Contacts</h2>
              <div className="space-y-3">
                <div className="flex items-center bg-white/5 p-3 rounded-lg">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <User className="text-secondary h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">Primary Contact</h3>
                    <p className="text-white/60 text-xs">Add an emergency contact</p>
                  </div>
                  <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                variant="link" 
                className="w-full text-secondary text-sm mt-3" 
                onClick={() => setLocation("/dashboard")}
              >
                Manage Emergency Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
}
