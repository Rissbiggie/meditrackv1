import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Icon } from "@/components/ui/icon";
import { Phone, MapPin, Navigation, User, UserRound } from "lucide-react";

export default function HomePage() {
  const { 
    openEmergencyModal, 
    nearbyFacilities, 
    nearbyAmbulances 
  } = useEmergency();

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader />

      <main className="pt-20 px-4">
        <div className="fade-in">
          {/* Emergency Assistance Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-2">Emergency Assistance</h2>
              <p className="text-white/80 text-sm mb-4">Press the button below to request immediate medical assistance</p>
              <Button 
                onClick={openEmergencyModal}
                className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-bold py-6 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#EF4444]/30 mb-2"
              >
                <Icon name="ambulance" className="text-2xl mr-3 h-6 w-6" />
                <span className="text-xl">EMERGENCY</span>
              </Button>
              <p className="text-white/60 text-xs text-center">Your location will be shared with emergency services</p>
            </CardContent>
          </Card>

          {/* Nearby Facilities Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Nearby Facilities</h2>
              <div className="h-40 bg-gray-800/50 rounded-lg mb-3 flex items-center justify-center">
                {/* Map placeholder - will be replaced by actual map component */}
                <div className="text-white/40 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Interactive Map</p>
                </div>
              </div>
              <div className="space-y-3">
                {nearbyFacilities ? (
                  nearbyFacilities.slice(0, 2).map((facility) => (
                    <div key={facility.id} className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="bg-white/10 p-2 rounded-full mr-3">
                        <i className="fas fa-hospital text-secondary"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{facility.name}</h3>
                        <p className="text-white/60 text-xs">{facility.type} • {facility.openHours}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <i className="fas fa-directions"></i>
                      </Button>
                    </div>
                  ))
                ) : (
                  // Default UI when no data is available
                  <>
                    <div className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="bg-white/10 p-2 rounded-full mr-3">
                        <Icon name="hospital" className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">City General Hospital</h3>
                        <p className="text-white/60 text-xs">1.2 miles away • Open 24/7</p>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="bg-white/10 p-2 rounded-full mr-3">
                        <Icon name="hospital" className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">Urgent Care Center</h3>
                        <p className="text-white/60 text-xs">0.8 miles away • Open until 10PM</p>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <Button variant="link" className="w-full text-secondary text-sm mt-3">
                View All Nearby Facilities
              </Button>
            </CardContent>
          </Card>
          
          {/* Emergency Contacts Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Emergency Contacts</h2>
              <div className="space-y-3">
                {/* These will be replaced by actual data from API */}
                <div className="flex items-center bg-white/5 p-3 rounded-lg">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <User className="text-secondary h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">Jane Doe (Emergency Contact)</h3>
                    <p className="text-white/60 text-xs">+1 (555) 123-4567</p>
                  </div>
                  <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center bg-white/5 p-3 rounded-lg">
                  <div className="bg-white/10 p-2 rounded-full mr-3">
                    <UserRound className="text-secondary h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">Dr. Smith (Primary Physician)</h3>
                    <p className="text-white/60 text-xs">+1 (555) 987-6543</p>
                  </div>
                  <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="link" className="w-full text-secondary text-sm mt-3">
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
