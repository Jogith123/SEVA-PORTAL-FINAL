import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  ssn: text("ssn"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  businessName: text("business_name"),
  businessCategory: text("business_category"),
  isAdmin: boolean("is_admin").default(false),
  profileSyncedAt: timestamp("profile_synced_at"),
});

export const documentRequests = pgTable("document_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileCount: integer("file_count").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, under_review
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  extractedFiles: json("extracted_files").$type<ExtractedFile[]>(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => documentRequests.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  extractedAt: timestamp("extracted_at").notNull().defaultNow(),
});

export type ExtractedFile = {
  name: string;
  type: string;
  size: number;
  path: string;
};

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  profileSyncedAt: true,
});

export const insertDocumentRequestSchema = createInsertSchema(documentRequests).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  extractedAt: true,
});

export const updateUserProfileSchema = insertUserSchema.pick({
  fullName: true,
  email: true,
  phone: true,
  ssn: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  businessName: true,
  businessCategory: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDocumentRequest = z.infer<typeof insertDocumentRequestSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type User = typeof users.$inferSelect;
export type DocumentRequest = typeof documentRequests.$inferSelect;
export type Document = typeof documents.$inferSelect;
