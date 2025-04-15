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
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, role: UserRole): Promise<User>;
  
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
  sessionStore: any; // Express session store instance
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // SessionStore instance

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session'
    });
    
    // Seed the database with initial data if needed
    this.seedDatabaseIfNeeded();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async updateUserRole(userId: number, role: UserRole): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }
  
  // Medical info operations
  async getMedicalInfoByUserId(userId: number): Promise<MedicalInfo | undefined> {
    const [info] = await db.select().from(medicalInfo).where(eq(medicalInfo.userId, userId));
    return info;
  }
  
  async updateMedicalInfo(infoData: InsertMedicalInfo): Promise<MedicalInfo> {
    const existingInfo = await this.getMedicalInfoByUserId(infoData.userId);
    
    if (existingInfo) {
      const [updatedInfo] = await db.update(medicalInfo)
        .set(infoData)
        .where(eq(medicalInfo.id, existingInfo.id))
        .returning();
      return updatedInfo;
    } else {
      const [newInfo] = await db.insert(medicalInfo)
        .values(infoData)
        .returning();
      return newInfo;
    }
  }
  
  // Emergency contact operations
  async getEmergencyContactsByUserId(userId: number): Promise<EmergencyContact[]> {
    return await db.select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId));
  }
  
  async createEmergencyContact(contactData: InsertEmergencyContact): Promise<EmergencyContact> {
    const [contact] = await db.insert(emergencyContacts)
      .values(contactData)
      .returning();
    return contact;
  }
  
  // Emergency alert operations
  async createEmergencyAlert(alertData: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [alert] = await db.insert(emergencyAlerts)
      .values({
        ...alertData,
        status: "active"
        // createdAt will be set by the default in the schema
      })
      .returning();
    return alert;
  }
  
  async getActiveEmergencies(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.status, "active"))
      .orderBy(desc(emergencyAlerts.createdAt));
  }
  
  async getUserEmergencyHistory(userId: number): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.userId, userId))
      .orderBy(desc(emergencyAlerts.createdAt));
  }
  
  async getRecentEmergencies(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .orderBy(desc(emergencyAlerts.createdAt))
      .limit(5);
  }
  
  async resolveEmergency(id: number): Promise<EmergencyAlert> {
    const [updatedEmergency] = await db.update(emergencyAlerts)
      .set({ status: "resolved" })
      .where(eq(emergencyAlerts.id, id))
      .returning();
    
    if (!updatedEmergency) {
      throw new Error("Emergency not found");
    }
    
    return updatedEmergency;
  }
  
  async assignAmbulance(emergencyId: number, ambulanceId: number): Promise<EmergencyAlert> {
    // Update ambulance status
    const [updatedAmbulance] = await db.update(ambulanceUnits)
      .set({ status: "dispatched" })
      .where(eq(ambulanceUnits.id, ambulanceId))
      .returning();
    
    if (!updatedAmbulance) {
      throw new Error("Ambulance unit not found");
    }
    
    // Update emergency with ambulance assignment
    const [updatedEmergency] = await db.update(emergencyAlerts)
      .set({ 
        status: "in_progress",
        ambulanceId: ambulanceId
      })
      .where(eq(emergencyAlerts.id, emergencyId))
      .returning();
    
    if (!updatedEmergency) {
      throw new Error("Emergency not found");
    }
    
    return updatedEmergency;
  }
  
  // Ambulance operations
  async getAmbulanceUnits(): Promise<AmbulanceUnit[]> {
    return await db.select().from(ambulanceUnits);
  }
  
  async getAvailableAmbulanceUnits(): Promise<AmbulanceUnit[]> {
    return await db.select()
      .from(ambulanceUnits)
      .where(eq(ambulanceUnits.status, "available"));
  }
  
  async getNearbyAmbulances(lat: number, lng: number): Promise<AmbulanceUnit[]> {
    // First get all ambulances
    const allAmbulances = await db.select().from(ambulanceUnits);
    
    // Filter and sort by distance
    return allAmbulances
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
    const [updatedAmbulance] = await db.update(ambulanceUnits)
      .set({ status })
      .where(eq(ambulanceUnits.id, id))
      .returning();
    
    if (!updatedAmbulance) {
      throw new Error("Ambulance unit not found");
    }
    
    return updatedAmbulance;
  }
  
  async updateAmbulanceLocation(id: number, lat: number, lng: number): Promise<AmbulanceUnit> {
    const [updatedAmbulance] = await db.update(ambulanceUnits)
      .set({ 
        latitude: lat.toString(), 
        longitude: lng.toString() 
      })
      .where(eq(ambulanceUnits.id, id))
      .returning();
    
    if (!updatedAmbulance) {
      throw new Error("Ambulance unit not found");
    }
    
    return updatedAmbulance;
  }
  
  // Medical facility operations
  async getMedicalFacilities(): Promise<MedicalFacility[]> {
    return await db.select().from(medicalFacilities);
  }
  
  async getNearbyFacilities(lat: number, lng: number): Promise<MedicalFacility[]> {
    // Get all facilities
    const allFacilities = await db.select().from(medicalFacilities);
    
    // Filter and sort by distance
    return allFacilities
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
  
  // Seed the database with sample data if needed
  private async seedDatabaseIfNeeded(): Promise<void> {
    try {
      // Check if the tables exist
      const tableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'ambulance_units'
        );
      `);
      
      if (!tableExists.rows[0].exists) {
        console.log("Tables do not exist yet. Skipping seeding...");
        return;
      }

      // Check if we already have ambulance units
      const existingAmbulances = await db.select().from(ambulanceUnits);
      
      if (existingAmbulances.length === 0) {
        console.log("Seeding database with initial data...");
        
        // Sample ambulances
        await db.insert(ambulanceUnits).values([
          {
            name: "Ambulance Unit 103",
            latitude: "37.7749",
            longitude: "-122.4194",
            status: "available",
          },
          {
            name: "Ambulance Unit 105",
            latitude: "37.7833",
            longitude: "-122.4167",
            status: "available",
          },
          {
            name: "MedEvac Helicopter",
            latitude: "37.8044",
            longitude: "-122.2711",
            status: "available",
          }
        ]);
        
        // Sample medical facilities
        await db.insert(medicalFacilities).values([
          {
            name: "City General Hospital",
            type: "Hospital",
            address: "123 Main St, Cityville",
            latitude: "37.7749",
            longitude: "-122.4194",
            phone: "555-123-4567",
            openHours: "24/7",
            rating: "4.8",
          },
          {
            name: "Urgent Care Center",
            type: "Urgent Care",
            address: "456 Oak Ave, Townsville",
            latitude: "37.7833",
            longitude: "-122.4167",
            phone: "555-987-6543",
            openHours: "8AM-10PM",
            rating: "4.5",
          },
          {
            name: "HealthPlus Pharmacy",
            type: "Pharmacy",
            address: "789 Elm St, Villageton",
            latitude: "37.7894",
            longitude: "-122.4107",
            phone: "555-456-7890",
            openHours: "9AM-9PM",
            rating: "4.2",
          }
        ]);
        
        console.log("Database seeded successfully!");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }
}

export const storage = new DatabaseStorage();
