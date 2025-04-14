import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEmergency } from "@/hooks/use-emergency";
import { Heartbeat } from "@/components/ui/heartbeat";
import { Loader2, MapPin, Ambulance } from "lucide-react";
import { LocationMap } from "@/components/maps/location-map";
import { useLocation } from "@/hooks/use-maps";
import { Icon } from "@/components/ui/icon";

export function EmergencyModal() {
  const { 
    isEmergencyModalOpen, 
    closeEmergencyModal, 
    submitEmergency,
    isSubmittingEmergency
  } = useEmergency();
  const [emergencyType, setEmergencyType] = useState("");
  const [description, setDescription] = useState("");
  const { getCurrentLocation } = useLocation();
  const [locationData, setLocationData] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (isEmergencyModalOpen) {
      setIsLoadingLocation(true);
      getCurrentLocation()
        .then(loc => {
          if (loc) {
            setLocationData(loc);
          }
        })
        .finally(() => setIsLoadingLocation(false));
    }
  }, [isEmergencyModalOpen]);

  const handleSubmit = () => {
    if (!emergencyType) {
      return; // Validate emergency type is selected
    }
    submitEmergency({ emergencyType, description });
  };

  const handleTypeSelect = (type: string) => {
    setEmergencyType(type);
  };

  if (!isEmergencyModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-primary border border-accent/50 rounded-xl max-w-md w-full p-5 shadow-2xl">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto relative animate-pulse">
            <Heartbeat size="lg" className="text-[#EF4444]" />
          </div>
          <h2 className="text-white font-bold text-xl mt-2">Emergency Alert</h2>
          <p className="text-white/80">We're sending help your way</p>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Your Location</h3>
            <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full animate-pulse">Sharing</span>
          </div>

          {isLoadingLocation ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : locationData ? (
            <div className="h-40 rounded-lg overflow-hidden">
              <LocationMap latitude={locationData.latitude} longitude={locationData.longitude} />
            </div>
          ) : (
            <div className="h-40 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="text-white/40 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="text-sm">Unable to determine location</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-white font-medium mb-2">Emergency Type</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className={`bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 ${emergencyType === 'Medical' ? 'bg-accent text-white' : ''}`}
              onClick={() => handleTypeSelect('Medical')}
            >
              Medical
            </Button>
            <Button 
              variant="outline" 
              className={`bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 ${emergencyType === 'Accident' ? 'bg-accent text-white' : ''}`}
              onClick={() => handleTypeSelect('Accident')}
            >
              Accident
            </Button>
            <Button 
              variant="outline" 
              className={`bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 ${emergencyType === 'Fire' ? 'bg-accent text-white' : ''}`}
              onClick={() => handleTypeSelect('Fire')}
            >
              Fire
            </Button>
            <Button 
              variant="outline" 
              className={`bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 ${emergencyType === 'Other' ? 'bg-accent text-white' : ''}`}
              onClick={() => handleTypeSelect('Other')}
            >
              Other
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-white font-medium mb-2">Additional Information</h3>
          <Textarea 
            className="w-full bg-white/10 rounded-lg p-3 text-white border border-white/10 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent h-24"
            placeholder="Describe your emergency situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex space-x-3">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
            onClick={closeEmergencyModal}
            disabled={isSubmittingEmergency}
          >
            Cancel Emergency
          </Button>
          <Button 
            className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={!emergencyType || isSubmittingEmergency}
          >
            {isSubmittingEmergency ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Ambulance className="mr-2 h-4 w-4" />
                Confirm
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmergencyModal;