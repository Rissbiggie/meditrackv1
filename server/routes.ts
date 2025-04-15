import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import { calculateDistance } from "../client/src/hooks/use-maps";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  // Get medical information for a user
  app.get("/api/medical-info", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const medicalInfo = await storage.getMedicalInfoByUserId(req.user.id);
      return res.json(medicalInfo);
    } catch (error) {
      console.error("Error retrieving medical info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update medical information
  app.post("/api/medical-info", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const updatedInfo = await storage.updateMedicalInfo({
        ...req.body,
        userId: req.user.id
      });
      return res.json(updatedInfo);
    } catch (error) {
      console.error("Error updating medical info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get emergency contacts for a user
  app.get("/api/emergency-contacts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const contacts = await storage.getEmergencyContactsByUserId(req.user.id);
      return res.json(contacts);
    } catch (error) {
      console.error("Error retrieving emergency contacts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create emergency alert
  app.post("/api/emergencies", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const alert = await storage.createEmergencyAlert({
        ...req.body,
        userId: req.user.id
      });
      return res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating emergency alert:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get active emergencies
  app.get("/api/emergencies/active", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const emergencies = await storage.getActiveEmergencies();
      return res.json(emergencies);
    } catch (error) {
      console.error("Error retrieving active emergencies:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's emergency history
  app.get("/api/emergencies/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const emergencies = await storage.getUserEmergencyHistory(req.user.id);
      return res.json(emergencies);
    } catch (error) {
      console.error("Error retrieving user emergency history:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent emergencies
  app.get("/api/emergencies/recent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const emergencies = await storage.getRecentEmergencies();
      return res.json(emergencies);
    } catch (error) {
      console.error("Error retrieving recent emergencies:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mark emergency as resolved
  app.post("/api/emergencies/:id/resolve", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const emergencyId = parseInt(req.params.id);
      const resolvedEmergency = await storage.resolveEmergency(emergencyId);
      return res.json(resolvedEmergency);
    } catch (error) {
      console.error("Error resolving emergency:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assign ambulance to emergency
  app.post("/api/emergencies/assign", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { emergencyId, ambulanceId } = req.body;
      const updatedEmergency = await storage.assignAmbulance(emergencyId, ambulanceId);
      return res.json(updatedEmergency);
    } catch (error) {
      console.error("Error assigning ambulance:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get ambulance units
  app.get("/api/ambulances", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const ambulances = await storage.getAmbulanceUnits();
      return res.json(ambulances);
    } catch (error) {
      console.error("Error retrieving ambulance units:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get available ambulance units
  app.get("/api/ambulances/available", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const ambulances = await storage.getAvailableAmbulanceUnits();
      return res.json(ambulances);
    } catch (error) {
      console.error("Error retrieving available ambulance units:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get nearby ambulances
  app.get("/api/ambulances/nearby", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { latitude, longitude } = req.query;
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const ambulances = await storage.getNearbyAmbulances(
        parseFloat(latitude as string), 
        parseFloat(longitude as string)
      );
      return res.json(ambulances);
    } catch (error) {
      console.error("Error retrieving nearby ambulances:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get nearby medical facilities
  app.get("/api/facilities/nearby", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { latitude, longitude } = req.query;
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const facilities = await storage.getNearbyFacilities(
        parseFloat(latitude as string), 
        parseFloat(longitude as string)
      );
      return res.json(facilities);
    } catch (error) {
      console.error("Error retrieving nearby facilities:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users (admin only)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Error retrieving users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user role (admin only)
  app.put("/api/users/:id/role", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const { role } = req.body;
      const userId = parseInt(req.params.id);
      
      if (!role || !Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);
      return res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Set role as admin for the first user
      const userCount = await storage.getUserCount();
      const role = userCount === 0 ? "admin" : "user";

      const newUser = await storage.createUser({
        ...req.body,
        role
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        // Handle location updates
        if (data.type === 'location_update') {
          // Broadcast to all relevant clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'location_update',
                data: {
                  id: data.id,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  role: data.role
                }
              }));
            }
          });
        }

        // Handle emergency broadcasts
        if (data.type === 'emergency_alert') {
          // Store emergency in database
          const emergency = await storage.createEmergencyAlert({
            userId: data.userId,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            emergencyType: data.emergencyType,
            description: data.description || ''
          });

          // Broadcast emergency to response teams
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'emergency_broadcast',
                data: emergency
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}