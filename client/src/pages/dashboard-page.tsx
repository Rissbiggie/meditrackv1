import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { useQuery } from "@tanstack/react-query";
import { MedicalInfo } from "@shared/schema";

export default function DashboardPage() {
  const { userEmergencyHistory } = useEmergency();
  
  // Query for medical information
  const { data: medicalInfo } = useQuery<MedicalInfo | null>({
    queryKey: ['/api/medical-info'],
  });

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Dashboard" />

      <main className="pt-20 px-4">
        <div className="fade-in mb-6">
          <h2 className="text-white font-semibold text-xl mb-3">Your Dashboard</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card className="bg-white/10 rounded-xl border-none">
              <CardContent className="p-4 text-center">
                <div className="text-secondary text-3xl mb-1"><i className="fas fa-ambulance"></i></div>
                <p className="text-white/80 text-xs">Emergency Requests</p>
                <p className="text-white font-semibold text-xl">{userEmergencyHistory?.length || 0}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 rounded-xl border-none">
              <CardContent className="p-4 text-center">
                <div className="text-secondary text-3xl mb-1"><i className="fas fa-clock"></i></div>
                <p className="text-white/80 text-xs">Avg. Response Time</p>
                <p className="text-white font-semibold text-xl">4.5 min</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">Emergency History</h3>
                <Button variant="link" className="text-secondary text-sm">View All</Button>
              </div>
              <div className="space-y-3">
                {userEmergencyHistory && userEmergencyHistory.length > 0 ? (
                  userEmergencyHistory.slice(0, 3).map((emergency) => (
                    <div key={emergency.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-white font-medium text-sm">{emergency.emergencyType}</h4>
                        <span className="text-white/60 text-xs">{new Date(emergency.createdAt || '').toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/70 text-xs mb-2">{emergency.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">
                          {emergency.status === 'active' ? 'Active' : 'Resolved'}
                        </span>
                        <span className="text-white/60 text-xs">Response time: 5 min</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/5 rounded-lg p-3 text-center text-white/60 py-6">
                    <p>No emergency history found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Medical Information</h3>
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded-lg">
                <h4 className="text-white/80 text-xs mb-1">Blood Type</h4>
                <p className="text-white font-medium">{medicalInfo?.bloodType || "Not specified"}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <h4 className="text-white/80 text-xs mb-1">Allergies</h4>
                <p className="text-white font-medium">{medicalInfo?.allergies || "None reported"}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <h4 className="text-white/80 text-xs mb-1">Chronic Conditions</h4>
                <p className="text-white font-medium">{medicalInfo?.conditions || "None reported"}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <h4 className="text-white/80 text-xs mb-1">Current Medications</h4>
                <p className="text-white font-medium">{medicalInfo?.medications || "None reported"}</p>
              </div>
            </div>
            <Button className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary font-medium py-2 px-4 rounded-lg mt-4 transition-all duration-300">
              Update Medical Information
            </Button>
          </CardContent>
        </Card>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
}
