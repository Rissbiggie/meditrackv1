import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['user', 'response_team', 'admin']);

export enum UserRole {
  USER = "user",
  RESPONSE_TEAM = "response_team",
  ADMIN = "admin"
}

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default(UserRole.USER),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  medicalInfo: one(medicalInfo, {
    fields: [users.id],
    references: [medicalInfo.userId],
  }),
  emergencyContacts: many(emergencyContacts),
  emergencyAlerts: many(emergencyAlerts),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Medical info table
export const medicalInfo = pgTable("medical_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  conditions: text("conditions"),
  medications: text("medications"),
});

export const medicalInfoRelations = relations(medicalInfo, ({ one }) => ({
  user: one(users, {
    fields: [medicalInfo.userId],
    references: [users.id],
  }),
}));

export const insertMedicalInfoSchema = createInsertSchema(medicalInfo).pick({
  userId: true,
  bloodType: true,
  allergies: true, 
  conditions: true,
  medications: true,
});

// Emergency contacts table
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  phone: text("phone").notNull(),
});

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
  }),
}));

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).pick({
  userId: true,
  name: true,
  relationship: true,
  phone: true,
});

// Emergency alerts table
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  ambulanceId: integer("ambulance_id").references(() => ambulanceUnits.id),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  emergencyType: text("emergency_type").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyAlertsRelations = relations(emergencyAlerts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyAlerts.userId],
    references: [users.id],
  }),
  ambulance: one(ambulanceUnits, {
    fields: [emergencyAlerts.ambulanceId],
    references: [ambulanceUnits.id],
  }),
}));

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts)
  .omit({ ambulanceId: true })
  .pick({
    userId: true,
    latitude: true,
    longitude: true,
    emergencyType: true,
    description: true,
  });

// Ambulance units table
export const ambulanceUnits = pgTable("ambulance_units", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  status: text("status").notNull().default("available"),
});

export const ambulanceUnitsRelations = relations(ambulanceUnits, ({ many }) => ({
  emergencyAlerts: many(emergencyAlerts),
}));

export const insertAmbulanceUnitSchema = createInsertSchema(ambulanceUnits).pick({
  name: true,
  latitude: true,
  longitude: true,
  status: true,
});

// Medical facilities table
export const medicalFacilities = pgTable("medical_facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  phone: text("phone"),
  openHours: text("open_hours"),
  rating: text("rating"),
});

export const insertMedicalFacilitySchema = createInsertSchema(medicalFacilities).pick({
  name: true,
  type: true,
  address: true,
  latitude: true,
  longitude: true,
  phone: true,
  openHours: true,
  rating: true,
});

// Types export
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type MedicalInfo = typeof medicalInfo.$inferSelect;
export type InsertMedicalInfo = z.infer<typeof insertMedicalInfoSchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;

export type AmbulanceUnit = typeof ambulanceUnits.$inferSelect;
export type InsertAmbulanceUnit = z.infer<typeof insertAmbulanceUnitSchema>;

export type MedicalFacility = typeof medicalFacilities.$inferSelect;
export type InsertMedicalFacility = z.infer<typeof insertMedicalFacilitySchema>;
