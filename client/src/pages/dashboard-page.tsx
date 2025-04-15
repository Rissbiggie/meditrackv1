import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { useQuery } from "@tanstack/react-query";
import { MedicalInfo, EmergencyContact } from "@shared/schema";
import { MedicalInfoModal } from "@/components/modals/medical-info-modal";
import { Loader, PencilIcon, PencilLine } from "lucide-react";
import { EmergencyContactsModal } from "@/components/modals/emergency-contacts-modal";

export default function DashboardPage() {
  const [isMedicalInfoModalOpen, setIsMedicalInfoModalOpen] = useState(false);
  const [isEmergencyContactsModalOpen, setIsEmergencyContactsModalOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // Query for medical information
  const { data: medicalInfo } = useQuery<MedicalInfo | null>({
    queryKey: ['/api/medical-info'],
  });

  // Query for emergency contacts
  const { data: emergencyContacts = [] } = useQuery<EmergencyContact[]>({
    queryKey: ['/api/emergency-contacts'],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Set page as loaded after a short delay to ensure all components are mounted
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isPageLoaded) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Dashboard" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <h2 className="text-white font-semibold text-xl mb-4">Dashboard</h2>

          {/* Medical Information */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Medical Information</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/10 hover:bg-white/20"
                  onClick={() => setIsMedicalInfoModalOpen(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Blood Type</p>
                  <p className="text-white">
                    {medicalInfo?.bloodType || (
                      <span className="text-white/40">Not specified</span>
                    )}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Allergies</p>
                  <p className="text-white">
                    {medicalInfo?.allergies || (
                      <span className="text-white/40">None reported</span>
                    )}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Chronic Conditions</p>
                  <p className="text-white">
                    {medicalInfo?.conditions || (
                      <span className="text-white/40">None reported</span>
                    )}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Current Medications</p>
                  <p className="text-white">
                    {medicalInfo?.medications || (
                      <span className="text-white/40">None reported</span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-secondary/20 hover:bg-secondary/30 text-secondary"
                onClick={() => setIsMedicalInfoModalOpen(true)}
              >
                Update Medical Information
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Emergency Contacts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:text-secondary/80"
                  onClick={() => setIsEmergencyContactsModalOpen(true)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {emergencyContacts.length === 0 ? (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/60 text-center">No emergency contacts added</p>
                  </div>
                ) : (
                  emergencyContacts.map((contact) => (
                    <div key={contact.id} className="bg-white/5 p-3 rounded-lg">
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-white/60 text-sm">Relationship: {contact.relationship}</p>
                      <p className="text-white/60 text-sm">Phone: {contact.phone}</p>
                    </div>
                  ))
                )}
              </div>
              <Button
                className="w-full mt-4 bg-secondary/20 hover:bg-secondary/30 text-secondary"
                onClick={() => setIsEmergencyContactsModalOpen(true)}
              >
                {emergencyContacts.length === 0 ? "Add Emergency Contacts" : "Manage Emergency Contacts"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
      <MedicalInfoModal 
        isOpen={isMedicalInfoModalOpen}
        onClose={() => setIsMedicalInfoModalOpen(false)}
        medicalInfo={medicalInfo}
      />
      <EmergencyContactsModal
        isOpen={isEmergencyContactsModalOpen}
        onClose={() => setIsEmergencyContactsModalOpen(false)}
      />
    </div>
  );
}
