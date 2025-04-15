import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmergency } from "@/hooks/use-emergency";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, MapPin, Clock, Star, Phone } from "lucide-react";

type MedicalFacility = {
  id: string;
  name: string;
  address: string;
  type: string;
  rating: number;
  openHours: string;
  distance: string;
  phone: string;
};

type FacilityType = "all" | "hospitals" | "urgent" | "pharmacies" | "specialists";
type FacilityCategory = Exclude<FacilityType, "all">;

const facilityIcons: Record<FacilityCategory, string> = {
  hospitals: "🏥",
  urgent: "🚑",
  pharmacies: "💊",
  specialists: "👨‍⚕️"
};

export default function ServicesPage() {
  const [activeFilter, setActiveFilter] = useState<FacilityType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<FacilityType>("all");
  const [facilities, setFacilities] = useState<MedicalFacility[]>([
    // Hospitals
    {
      id: "1",
      name: "City General Hospital",
      address: "123 Main Street",
      type: "hospital",
      rating: 4.8,
      openHours: "Open 24/7",
      distance: "1.2 miles",
      phone: "(555) 123-4567"
    },
    {
      id: "2",
      name: "St. Mary's Medical Center",
      address: "789 Health Avenue",
      type: "hospital",
      rating: 4.6,
      openHours: "Open 24/7",
      distance: "2.1 miles",
      phone: "(555) 234-5678"
    },
    {
      id: "3",
      name: "Metropolitan Hospital",
      address: "456 Medical Drive",
      type: "hospital",
      rating: 4.7,
      openHours: "Open 24/7",
      distance: "3.5 miles",
      phone: "(555) 345-6789"
    },
    // Urgent Care
    {
      id: "4",
      name: "Urgent Care Center",
      address: "456 Oak Avenue",
      type: "urgent",
      rating: 4.5,
      openHours: "Open until 10PM",
      distance: "0.8 miles",
      phone: "(555) 456-7890"
    },
    {
      id: "5",
      name: "QuickCare Medical",
      address: "321 Fast Lane",
      type: "urgent",
      rating: 4.3,
      openHours: "Open until 11PM",
      distance: "1.5 miles",
      phone: "(555) 567-8901"
    },
    {
      id: "6",
      name: "Express Urgent Care",
      address: "654 Speed Street",
      type: "urgent",
      rating: 4.4,
      openHours: "Open until 9PM",
      distance: "2.3 miles",
      phone: "(555) 678-9012"
    },
    // Pharmacies
    {
      id: "7",
      name: "Downtown Pharmacy",
      address: "789 Market Street",
      type: "pharmacy",
      rating: 4.2,
      openHours: "Open until 9PM",
      distance: "0.5 miles",
      phone: "(555) 789-0123"
    },
    {
      id: "8",
      name: "MediQuick Pharmacy",
      address: "123 Health Lane",
      type: "pharmacy",
      rating: 4.1,
      openHours: "Open until 8PM",
      distance: "1.1 miles",
      phone: "(555) 890-1234"
    },
    {
      id: "9",
      name: "24-Hour Pharmacy",
      address: "456 Round Street",
      type: "pharmacy",
      rating: 4.3,
      openHours: "Open 24/7",
      distance: "1.8 miles",
      phone: "(555) 901-2345"
    },
    // Specialists
    {
      id: "10",
      name: "Specialist Medical Center",
      address: "321 Pine Road",
      type: "specialist",
      rating: 4.7,
      openHours: "Open until 6PM",
      distance: "1.5 miles",
      phone: "(555) 012-3456"
    },
    {
      id: "11",
      name: "Advanced Care Specialists",
      address: "987 Expert Avenue",
      type: "specialist",
      rating: 4.9,
      openHours: "Open until 5PM",
      distance: "2.2 miles",
      phone: "(555) 123-4567"
    },
    {
      id: "12",
      name: "Precision Medical Group",
      address: "654 Specialist Drive",
      type: "specialist",
      rating: 4.6,
      openHours: "Open until 7PM",
      distance: "0.9 miles",
      phone: "(555) 234-5678"
    }
  ]);

  const [filteredFacilities, setFilteredFacilities] = useState<MedicalFacility[]>([]);

  // Initialize filtered facilities with all facilities
  useEffect(() => {
    setFilteredFacilities(facilities);
  }, [facilities]);

  const [isLoading, setIsLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<FacilityType, boolean>>({
    all: false,
    hospitals: false,
    urgent: false,
    pharmacies: false,
    specialists: false
  });
  const { nearbyFacilities } = useEmergency();

  // Handle search and filtering
  useEffect(() => {
    const searchFacilities = () => {
      setIsLoading(true);
      try {
        let results = [...facilities];
        
        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          results = results.filter(facility => 
            facility.name.toLowerCase().includes(query) ||
            facility.address.toLowerCase().includes(query) ||
            facility.type.toLowerCase().includes(query)
          );
        }

        // Filter by selected type if not "all"
        if (selectedType !== "all") {
          results = results.filter(facility => {
            const facilityType = facility.type.toLowerCase();
            switch (selectedType) {
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
        }

        // Sort by distance
        results.sort((a, b) => {
          const distanceA = parseFloat(a.distance.split(" ")[0]);
          const distanceB = parseFloat(b.distance.split(" ")[0]);
          return distanceA - distanceB;
        });

        setFilteredFacilities(results);
      } catch (error) {
        console.error('Error searching facilities:', error);
        setFilteredFacilities([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchFacilities();
  }, [searchQuery, selectedType, facilities]);

  const toggleCategory = (category: FacilityType) => {
    // First update the open state of the category
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));

    // Only update filters if the category is being opened
    if (!openCategories[category]) {
      setActiveFilter(category);
      setSelectedType(category);
    }
  };

  const getFacilitiesByType = (type: FacilityType) => {
    if (type === "all") return filteredFacilities;
    return filteredFacilities.filter(facility => {
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
                {(["hospitals", "urgent", "pharmacies", "specialists"] as FacilityCategory[]).map((category) => (
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
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{facilityIcons[category]}</span>
                          <span className="capitalize">{category}</span>
                        </div>
                        {openCategories[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {isLoading ? (
                        <div className="text-center py-4 text-white/60">Loading...</div>
                      ) : getFacilitiesByType(category).length === 0 ? (
                        <div className="text-center py-4 text-white/60">No {category} found</div>
                      ) : (
                        getFacilitiesByType(category).map((facility) => (
                          <div
                            key={facility.id}
                            className="bg-white/5 p-4 rounded-lg space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="text-white font-medium">{facility.name}</h3>
                              <div className="flex items-center text-yellow-400">
                                <Star size={14} className="mr-1" />
                                <span className="text-sm">{facility.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-white/60 text-sm">
                              <MapPin size={14} className="mr-1" />
                              <span>{facility.distance} away</span>
                            </div>
                            <div className="flex items-center text-white/60 text-sm">
                              <Clock size={14} className="mr-1" />
                              <span>{facility.openHours}</span>
                            </div>
                            <div className="flex items-center text-white/60 text-sm">
                              <Phone size={14} className="mr-1" />
                              <span>{facility.phone}</span>
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