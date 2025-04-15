import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

type MedicalFacility = {
  id: string;
  name: string;
  address: string;
  type: string;
  rating: number;
  openHours: string;
};

type FacilityType = "all" | "hospitals" | "urgent" | "pharmacies" | "specialists";

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<FacilityType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<FacilityType, boolean>>({
    all: false,
    hospitals: false,
    urgent: false,
    pharmacies: false,
    specialists: false
  });
  const { nearbyFacilities } = useEmergency();

  useEffect(() => {
    const searchFacilities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/facilities/search?query=${encodeURIComponent(searchQuery)}&type=${selectedType}`);
        if (!response.ok) throw new Error('Failed to fetch facilities');
        const data = await response.json();
        setFacilities(data);
      } catch (error) {
        console.error('Error searching facilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchFacilities();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedType]);

  const toggleCategory = (category: FacilityType) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    setActiveFilter(category);
  };

  const getFacilitiesByType = (type: FacilityType) => {
    if (type === "all") return facilities;
    return facilities.filter(facility => {
      const facilityType = facility.type.toLowerCase();
      switch (type) {
        case "hospitals":
          return facilityType.includes("hospital");
        case "urgent":
          return facilityType.includes("urgent");
        case "pharmacies":
          return facilityType.includes("pharmacy");
        case "specialists":
          return facilityType.includes("specialist");
        default:
          return true;
      }
    });
  };

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
              <div className="space-y-2">
                {(["all", "hospitals", "urgent", "pharmacies", "specialists"] as FacilityType[]).map((category) => (
                  <Collapsible
                    key={category}
                    open={openCategories[category]}
                    onOpenChange={() => toggleCategory(category)}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        className={`w-full flex justify-between items-center px-4 py-2 rounded-lg text-sm ${
                          activeFilter === category
                            ? "bg-secondary text-primary"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                      >
                        <span className="capitalize">{category}</span>
                        {openCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {isLoading ? (
                        <div className="text-center py-4 text-white/60">Loading...</div>
                      ) : getFacilitiesByType(category).length === 0 ? (
                        <div className="text-center py-4 text-white/60">No facilities found</div>
                      ) : (
                        getFacilitiesByType(category).map((facility) => (
                          <div
                            key={facility.id}
                            className="flex items-center bg-white/5 p-3 rounded-lg"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-700 mr-3 flex items-center justify-center">
                              <i className={`fas fa-${facility.type === 'Hospital' ? 'hospital' : facility.type === 'Pharmacy' ? 'prescription-bottle-alt' : 'clinic-medical'} text-white/60`}></i>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-medium text-sm">{facility.name}</h3>
                              <div className="flex items-center text-white/60 text-xs">
                                <i className="fas fa-star text-yellow-400 mr-1"></i>
                                <span>{facility.rating}</span>
                                <span className="mx-2">•</span>
                                <span>{facility.openHours}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
}