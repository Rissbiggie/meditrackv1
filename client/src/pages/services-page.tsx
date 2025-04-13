import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";

type FacilityType = "all" | "hospitals" | "urgent" | "pharmacies" | "specialists";

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<FacilityType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { nearbyFacilities } = useEmergency();

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Find Services" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          {/* Search and Filter Section */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Find Medical Services</h2>
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search services, hospitals, clinics..."
                  className="w-full bg-white/20 rounded-lg pl-10 pr-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3.5 text-white/70"></i>
              </div>
              <div className="flex overflow-x-auto space-x-3 pb-2 mb-4 hide-scrollbar">
                <Button
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                    activeFilter === "all"
                      ? "bg-secondary text-primary"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </Button>
                <Button
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                    activeFilter === "hospitals"
                      ? "bg-secondary text-primary"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveFilter("hospitals")}
                >
                  Hospitals
                </Button>
                <Button
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                    activeFilter === "urgent"
                      ? "bg-secondary text-primary"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveFilter("urgent")}
                >
                  Urgent Care
                </Button>
                <Button
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                    activeFilter === "pharmacies"
                      ? "bg-secondary text-primary"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveFilter("pharmacies")}
                >
                  Pharmacies
                </Button>
                <Button
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
                    activeFilter === "specialists"
                      ? "bg-secondary text-primary"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveFilter("specialists")}
                >
                  Specialists
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Section */}
          <div className="h-48 bg-gray-800/50 rounded-xl mb-4 flex items-center justify-center">
            <div className="text-white/40 text-center">
              <i className="fas fa-map-marked-alt text-3xl mb-2"></i>
              <p className="text-sm">Interactive Services Map</p>
            </div>
          </div>

          {/* Nearby Services Section */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">Nearby Services</h3>
                <Button variant="link" className="text-secondary text-sm">Filter</Button>
              </div>
              <div className="space-y-3">
                {nearbyFacilities && nearbyFacilities.length > 0 ? (
                  nearbyFacilities.map((facility) => (
                    <div key={facility.id} className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-gray-700 mr-3 flex items-center justify-center overflow-hidden">
                        <i className={`fas fa-${facility.type === 'Hospital' ? 'hospital' : facility.type === 'Pharmacy' ? 'prescription-bottle-alt' : 'clinic-medical'} text-white/60 text-xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{facility.name}</h3>
                        <div className="flex items-center text-white/60 text-xs">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>{facility.rating || '4.5'}</span>
                          <span className="mx-2">•</span>
                          <span>1.2 miles</span>
                        </div>
                        <span className="inline-block bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full mt-1">
                          Open • {facility.openHours || '24/7'}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                  ))
                ) : (
                  // Default content when no data is available
                  <>
                    <div className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-gray-700 mr-3 flex items-center justify-center overflow-hidden">
                        <i className="fas fa-hospital text-white/60 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">Memorial Hospital</h3>
                        <div className="flex items-center text-white/60 text-xs">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>4.8</span>
                          <span className="mx-2">•</span>
                          <span>1.2 miles</span>
                        </div>
                        <span className="inline-block bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full mt-1">Open • 24/7</span>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                    <div className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-gray-700 mr-3 flex items-center justify-center overflow-hidden">
                        <i className="fas fa-clinic-medical text-white/60 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">MediQuick Urgent Care</h3>
                        <div className="flex items-center text-white/60 text-xs">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>4.5</span>
                          <span className="mx-2">•</span>
                          <span>0.8 miles</span>
                        </div>
                        <span className="inline-block bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full mt-1">Open • Until 10PM</span>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                    <div className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-gray-700 mr-3 flex items-center justify-center overflow-hidden">
                        <i className="fas fa-prescription-bottle-alt text-white/60 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">HealthPlus Pharmacy</h3>
                        <div className="flex items-center text-white/60 text-xs">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>4.2</span>
                          <span className="mx-2">•</span>
                          <span>0.5 miles</span>
                        </div>
                        <span className="inline-block bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full mt-1">Open • Until 9PM</span>
                      </div>
                      <Button variant="ghost" size="sm" className="bg-secondary/20 text-secondary rounded-full p-2">
                        <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <Button variant="link" className="w-full text-secondary text-sm mt-4">View All Services</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
}
