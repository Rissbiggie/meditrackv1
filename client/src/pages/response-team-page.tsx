import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { EmergencyAlert, AmbulanceUnit } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Loader2 } from "lucide-react";

export default function ResponseTeamPage() {
  const { toast } = useToast();
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyAlert | null>(null);

  // Query for active emergencies
  const { 
    data: activeEmergencies, 
    isLoading: isLoadingEmergencies 
  } = useQuery<EmergencyAlert[]>({
    queryKey: ['/api/emergencies/active'],
  });

  // Query for available units
  const { 
    data: availableUnits, 
    isLoading: isLoadingUnits 
  } = useQuery<AmbulanceUnit[]>({
    queryKey: ['/api/ambulances/available'],
  });

  // Query for recent emergencies
  const { 
    data: recentEmergencies 
  } = useQuery<EmergencyAlert[]>({
    queryKey: ['/api/emergencies/recent'],
  });

  // Assign ambulance to emergency
  const assignAmbulanceMutation = useMutation({
    mutationFn: async ({ 
      emergencyId, ambulanceId 
    }: { 
      emergencyId: number; 
      ambulanceId: number 
    }) => {
      const res = await apiRequest("POST", "/api/emergencies/assign", {
        emergencyId,
        ambulanceId
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Ambulance assigned",
        description: "The ambulance has been assigned to the emergency.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergencies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ambulances/available'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark emergency as resolved
  const resolveEmergencyMutation = useMutation({
    mutationFn: async (emergencyId: number) => {
      const res = await apiRequest("POST", `/api/emergencies/${emergencyId}/resolve`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Emergency resolved",
        description: "The emergency has been marked as resolved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergencies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/emergencies/recent'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Resolution failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Response Team" />

      <main className="pt-20 px-4">
        <div className="mb-6">
          <Card className="bg-accent/10 border border-accent/30 rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-lg">Active Emergencies</h2>
                <span className="bg-accent/20 text-accent text-xs px-3 py-1 rounded-full animate-pulse">LIVE</span>
              </div>
              <p className="text-white/80 text-sm mb-4">
                {isLoadingEmergencies 
                  ? "Loading active emergencies..." 
                  : activeEmergencies && activeEmergencies.length > 0 
                    ? `You have ${activeEmergencies.length} active emergency calls that need attention` 
                    : "No active emergencies at the moment"
                }
              </p>
              
              <div className="space-y-4">
                {isLoadingEmergencies ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : activeEmergencies && activeEmergencies.length > 0 ? (
                  activeEmergencies.map(emergency => (
                    <Card key={emergency.id} className="bg-white/5 rounded-xl border border-accent/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
                            {emergency.emergencyType} Emergency
                          </span>
                          <span className="text-white/60 text-xs">
                            {new Date(emergency.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-white font-medium mb-1">User #{emergency.userId}</h3>
                        <p className="text-white/70 text-sm mb-3">{emergency.description || "No description provided"}</p>
                        <div className="flex items-center text-white/70 text-sm mb-3">
                          <i className="fas fa-map-marker-alt mr-2 text-accent"></i>
                          <span>Lat: {emergency.latitude}, Long: {emergency.longitude}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            className="bg-secondary hover:bg-secondary/90 text-primary font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                            onClick={() => setSelectedEmergency(emergency)}
                          >
                            <i className="fas fa-ambulance mr-2"></i>
                            Assign Unit
                          </Button>
                          <Button 
                            className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                            onClick={() => resolveEmergencyMutation.mutate(emergency.id)}
                            disabled={resolveEmergencyMutation.isPending}
                          >
                            {resolveEmergencyMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <i className="fas fa-check-circle mr-2"></i>
                            )}
                            Resolve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="bg-white/5 rounded-xl p-6 text-center">
                    <div className="text-white/40 mb-2">
                      <i className="fas fa-check-circle text-3xl"></i>
                    </div>
                    <p className="text-white/70">No active emergencies at the moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Emergency Map Overview</h2>
              <div className="h-48 bg-gray-800/50 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-white/40 text-center">
                  <i className="fas fa-map-marked-alt text-3xl mb-2"></i>
                  <p className="text-sm">Interactive Emergency Map</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-white/70 text-sm">
                  <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                  <span>Active Emergencies</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Response Units</span>
                </div>
                <div className="flex items-center text-white/70 text-sm">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                  <span>Hospitals</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white font-semibold text-lg">Available Units</h2>
                <Button variant="link" className="text-secondary text-sm">View All</Button>
              </div>
              <div className="space-y-3">
                {isLoadingUnits ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                  </div>
                ) : availableUnits && availableUnits.length > 0 ? (
                  availableUnits.map(unit => (
                    <div key={unit.id} className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="bg-white/10 p-2 rounded-full mr-3">
                        <i className="fas fa-ambulance text-secondary"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{unit.name}</h3>
                        <p className="text-white/60 text-xs">
                          {unit.latitude && unit.longitude 
                            ? "Location available" 
                            : "Location unavailable"} • {unit.status}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="bg-secondary/20 text-secondary rounded-full p-2"
                        onClick={() => {
                          if (selectedEmergency) {
                            assignAmbulanceMutation.mutate({ 
                              emergencyId: selectedEmergency.id, 
                              ambulanceId: unit.id 
                            });
                            setSelectedEmergency(null);
                          } else {
                            toast({
                              title: "No emergency selected",
                              description: "Please select an emergency to assign this unit to.",
                              variant: "destructive",
                            });
                          }
                        }}
                        disabled={!selectedEmergency || assignAmbulanceMutation.isPending}
                      >
                        {assignAmbulanceMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <i className="fas fa-paper-plane"></i>
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/5 rounded-lg p-4 text-center text-white/60">
                    No available units at the moment
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white font-semibold text-lg">Recent Emergencies</h2>
                <Button variant="link" className="text-secondary text-sm">View All</Button>
              </div>
              <div className="space-y-3">
                {recentEmergencies && recentEmergencies.length > 0 ? (
                  recentEmergencies.map(emergency => (
                    <div key={emergency.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-white font-medium text-sm">{emergency.emergencyType} Emergency</h4>
                        <span className="text-white/60 text-xs">
                          {new Date(emergency.createdAt || '').toLocaleString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className="text-white/70 text-xs mb-2">
                        {emergency.description?.substring(0, 50) || "No description"}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className={`${
                          emergency.status === 'active' 
                            ? 'bg-yellow-900/30 text-yellow-400' 
                            : 'bg-green-900/30 text-green-400'
                        } text-xs px-2 py-1 rounded-full`}>
                          {emergency.status === 'active' ? 'In Progress' : 'Completed'}
                        </span>
                        <span className="text-white/60 text-xs">ID: #{emergency.id}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/5 rounded-lg p-4 text-center text-white/60">
                    No recent emergencies
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-secondary text-primary shadow-lg z-10">
        <div className="flex justify-around">
          <Button className="flex flex-col items-center py-3 px-4 transition-colors duration-300 text-primary">
            <i className="fas fa-bell text-lg"></i>
            <span className="text-xs mt-1 font-medium">Alerts</span>
          </Button>
          <Button className="flex flex-col items-center py-3 px-4 transition-colors duration-300 text-primary/70 hover:text-primary">
            <i className="fas fa-ambulance text-lg"></i>
            <span className="text-xs mt-1 font-medium">Units</span>
          </Button>
          <Button className="flex flex-col items-center py-3 px-4 transition-colors duration-300 text-primary/70 hover:text-primary">
            <i className="fas fa-comments text-lg"></i>
            <span className="text-xs mt-1 font-medium">Messages</span>
          </Button>
          <Button className="flex flex-col items-center py-3 px-4 transition-colors duration-300 text-primary/70 hover:text-primary">
            <i className="fas fa-cog text-lg"></i>
            <span className="text-xs mt-1 font-medium">Settings</span>
          </Button>
        </div>
      </nav>
      
      <EmergencyModal />
    </div>
  );
}
