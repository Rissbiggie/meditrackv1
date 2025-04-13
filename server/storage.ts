import { 
  users, 
  medicalInfo, 
  emergencyContacts, 
  emergencyAlerts, 
  ambulanceUnits, 
  medicalFacilities,
  type User, 
  type InsertUser, 
  type MedicalInfo,
  type InsertMedicalInfo,
  type EmergencyContact,
  type InsertEmergencyContact,
  type EmergencyAlert,
  type InsertEmergencyAlert,
  type AmbulanceUnit,
  type InsertAmbulanceUnit,
  type MedicalFacility,
  type InsertMedicalFacility
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { calculateDistance } from "../client/src/hooks/use-maps";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Medical info operations
  getMedicalInfoByUserId(userId: number): Promise<MedicalInfo | undefined>;
  updateMedicalInfo(info: InsertMedicalInfo): Promise<MedicalInfo>;
  
  // Emergency contact operations
  getEmergencyContactsByUserId(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  
  // Emergency alert operations
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getActiveEmergencies(): Promise<EmergencyAlert[]>;
  getUserEmergencyHistory(userId: number): Promise<EmergencyAlert[]>;
  getRecentEmergencies(): Promise<EmergencyAlert[]>;
  resolveEmergency(id: number): Promise<EmergencyAlert>;
  assignAmbulance(emergencyId: number, ambulanceId: number): Promise<EmergencyAlert>;
  
  // Ambulance operations
  getAmbulanceUnits(): Promise<AmbulanceUnit[]>;
  getAvailableAmbulanceUnits(): Promise<AmbulanceUnit[]>;
  getNearbyAmbulances(lat: number, lng: number): Promise<AmbulanceUnit[]>;
  updateAmbulanceStatus(id: number, status: string): Promise<AmbulanceUnit>;
  updateAmbulanceLocation(id: number, lat: number, lng: number): Promise<AmbulanceUnit>;
  
  // Medical facility operations
  getMedicalFacilities(): Promise<MedicalFacility[]>;
  getNearbyFacilities(lat: number, lng: number): Promise<MedicalFacility[]>;
  
  // Session storage
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicalInfos: Map<number, MedicalInfo>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  private ambulanceUnits: Map<number, AmbulanceUnit>;
  private medicalFacilities: Map<number, MedicalFacility>;
  
  sessionStore: session.SessionStore;
  userCounter: number;
  medicalInfoCounter: number;
  contactCounter: number;
  alertCounter: number;
  ambulanceCounter: number;
  facilityCounter: number;

  constructor() {
    this.users = new Map();
    this.medicalInfos = new Map();
    this.emergencyContacts = new Map();
    this.emergencyAlerts = new Map();
    this.ambulanceUnits = new Map();
    this.medicalFacilities = new Map();
    
    this.userCounter = 1;
    this.medicalInfoCounter = 1;
    this.contactCounter = 1;
    this.alertCounter = 1;
    this.ambulanceCounter = 1;
    this.facilityCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Medical info operations
  async getMedicalInfoByUserId(userId: number): Promise<MedicalInfo | undefined> {
    return Array.from(this.medicalInfos.values()).find(
      (info) => info.userId === userId
    );
  }
  
  async updateMedicalInfo(infoData: InsertMedicalInfo): Promise<MedicalInfo> {
    const existingInfo = await this.getMedicalInfoByUserId(infoData.userId);
    
    if (existingInfo) {
      const updatedInfo: MedicalInfo = { ...existingInfo, ...infoData };
      this.medicalInfos.set(existingInfo.id, updatedInfo);
      return updatedInfo;
    } else {
      const id = this.medicalInfoCounter++;
      const newInfo: MedicalInfo = { ...infoData, id };
      this.medicalInfos.set(id, newInfo);
      return newInfo;
    }
  }
  
  // Emergency contact operations
  async getEmergencyContactsByUserId(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(
      (contact) => contact.userId === userId
    );
  }
  
  async createEmergencyContact(contactData: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.contactCounter++;
    const contact: EmergencyContact = { ...contactData, id };
    this.emergencyContacts.set(id, contact);
    return contact;
  }
  
  // Emergency alert operations
  async createEmergencyAlert(alertData: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.alertCounter++;
    const now = new Date();
    const alert: EmergencyAlert = { 
      ...alertData, 
      id, 
      status: "active",
      createdAt: now.toISOString()
    };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
  
  async getActiveEmergencies(): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values())
      .filter(alert => alert.status === "active")
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || '');
        const dateB = new Date(b.createdAt || '');
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });
  }
  
  async getUserEmergencyHistory(userId: number): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || '');
        const dateB = new Date(b.createdAt || '');
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });
  }
  
  async getRecentEmergencies(): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values())
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || '');
        const dateB = new Date(b.createdAt || '');
        return dateB.getTime() - dateA.getTime(); // Most recent first
      })
      .slice(0, 5); // Get only 5 most recent
  }
  
  async resolveEmergency(id: number): Promise<EmergencyAlert> {
    const emergency = this.emergencyAlerts.get(id);
    if (!emergency) {
      throw new Error("Emergency not found");
    }
    
    const updatedEmergency: EmergencyAlert = { ...emergency, status: "resolved" };
    this.emergencyAlerts.set(id, updatedEmergency);
    return updatedEmergency;
  }
  
  async assignAmbulance(emergencyId: number, ambulanceId: number): Promise<EmergencyAlert> {
    const emergency = this.emergencyAlerts.get(emergencyId);
    if (!emergency) {
      throw new Error("Emergency not found");
    }
    
    const ambulance = this.ambulanceUnits.get(ambulanceId);
    if (!ambulance) {
      throw new Error("Ambulance unit not found");
    }
    
    // Update ambulance status
    const updatedAmbulance: AmbulanceUnit = { ...ambulance, status: "dispatched" };
    this.ambulanceUnits.set(ambulanceId, updatedAmbulance);
    
    // Update emergency with ambulance assignment
    const updatedEmergency: EmergencyAlert = { 
      ...emergency, 
      status: "in_progress"
    };
    this.emergencyAlerts.set(emergencyId, updatedEmergency);
    
    return updatedEmergency;
  }
  
  // Ambulance operations
  async getAmbulanceUnits(): Promise<AmbulanceUnit[]> {
    return Array.from(this.ambulanceUnits.values());
  }
  
  async getAvailableAmbulanceUnits(): Promise<AmbulanceUnit[]> {
    return Array.from(this.ambulanceUnits.values())
      .filter(unit => unit.status === "available");
  }
  
  async getNearbyAmbulances(lat: number, lng: number): Promise<AmbulanceUnit[]> {
    return Array.from(this.ambulanceUnits.values())
      .filter(unit => {
        if (!unit.latitude || !unit.longitude) return false;
        
        const distance = calculateDistance(
          lat, 
          lng, 
          parseFloat(unit.latitude), 
          parseFloat(unit.longitude)
        );
        
        return distance <= 10; // Within 10km
      })
      .sort((a, b) => {
        // Sort by distance
        const distA = calculateDistance(
          lat, 
          lng, 
          parseFloat(a.latitude || "0"), 
          parseFloat(a.longitude || "0")
        );
        const distB = calculateDistance(
          lat, 
          lng, 
          parseFloat(b.latitude || "0"), 
          parseFloat(b.longitude || "0")
        );
        return distA - distB;
      });
  }
  
  async updateAmbulanceStatus(id: number, status: string): Promise<AmbulanceUnit> {
    const ambulance = this.ambulanceUnits.get(id);
    if (!ambulance) {
      throw new Error("Ambulance unit not found");
    }
    
    const updatedAmbulance: AmbulanceUnit = { ...ambulance, status };
    this.ambulanceUnits.set(id, updatedAmbulance);
    return updatedAmbulance;
  }
  
  async updateAmbulanceLocation(id: number, lat: number, lng: number): Promise<AmbulanceUnit> {
    const ambulance = this.ambulanceUnits.get(id);
    if (!ambulance) {
      throw new Error("Ambulance unit not found");
    }
    
    const updatedAmbulance: AmbulanceUnit = { 
      ...ambulance, 
      latitude: lat.toString(), 
      longitude: lng.toString() 
    };
    this.ambulanceUnits.set(id, updatedAmbulance);
    return updatedAmbulance;
  }
  
  // Medical facility operations
  async getMedicalFacilities(): Promise<MedicalFacility[]> {
    return Array.from(this.medicalFacilities.values());
  }
  
  async getNearbyFacilities(lat: number, lng: number): Promise<MedicalFacility[]> {
    return Array.from(this.medicalFacilities.values())
      .filter(facility => {
        const distance = calculateDistance(
          lat, 
          lng, 
          parseFloat(facility.latitude), 
          parseFloat(facility.longitude)
        );
        
        return distance <= 10; // Within 10km
      })
      .sort((a, b) => {
        // Sort by distance
        const distA = calculateDistance(
          lat, 
          lng, 
          parseFloat(a.latitude), 
          parseFloat(a.longitude)
        );
        const distB = calculateDistance(
          lat, 
          lng, 
          parseFloat(b.latitude), 
          parseFloat(b.longitude)
        );
        return distA - distB;
      });
  }
  
  // Initialize with sample data
  private initializeSampleData(): void {
    // Sample ambulances
    const ambulance1: AmbulanceUnit = {
      id: this.ambulanceCounter++,
      name: "Ambulance Unit 103",
      latitude: "37.7749",
      longitude: "-122.4194",
      status: "available",
    };
    
    const ambulance2: AmbulanceUnit = {
      id: this.ambulanceCounter++,
      name: "Ambulance Unit 105",
      latitude: "37.7833",
      longitude: "-122.4167",
      status: "available",
    };
    
    const ambulance3: AmbulanceUnit = {
      id: this.ambulanceCounter++,
      name: "MedEvac Helicopter",
      latitude: "37.8044",
      longitude: "-122.2711",
      status: "available",
    };
    
    this.ambulanceUnits.set(ambulance1.id, ambulance1);
    this.ambulanceUnits.set(ambulance2.id, ambulance2);
    this.ambulanceUnits.set(ambulance3.id, ambulance3);
    
    // Sample medical facilities
    const facility1: MedicalFacility = {
      id: this.facilityCounter++,
      name: "City General Hospital",
      type: "Hospital",
      address: "123 Main St, Cityville",
      latitude: "37.7749",
      longitude: "-122.4194",
      phone: "555-123-4567",
      openHours: "24/7",
      rating: "4.8",
    };
    
    const facility2: MedicalFacility = {
      id: this.facilityCounter++,
      name: "Urgent Care Center",
      type: "Urgent Care",
      address: "456 Oak Ave, Townsville",
      latitude: "37.7833",
      longitude: "-122.4167",
      phone: "555-987-6543",
      openHours: "8AM-10PM",
      rating: "4.5",
    };
    
    const facility3: MedicalFacility = {
      id: this.facilityCounter++,
      name: "HealthPlus Pharmacy",
      type: "Pharmacy",
      address: "789 Elm St, Villageton",
      latitude: "37.7894",
      longitude: "-122.4107",
      phone: "555-456-7890",
      openHours: "9AM-9PM",
      rating: "4.2",
    };
    
    this.medicalFacilities.set(facility1.id, facility1);
    this.medicalFacilities.set(facility2.id, facility2);
    this.medicalFacilities.set(facility3.id, facility3);
  }
}

export const storage = new MemStorage();
