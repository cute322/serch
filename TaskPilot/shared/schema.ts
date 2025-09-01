import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  input: text("input").notNull(),
  query: text("query").notNull(),
  engine: varchar("engine").notNull(),
  url: text("url").notNull(),
  explanation: text("explanation"),
  queryData: jsonb("query_data"),
  createdAt: timestamp("created_at").defaultNow(),
  deviceId: varchar("device_id"),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  queryName: text("query_name").notNull(),
  queryData: jsonb("query_data").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  deviceId: varchar("device_id"),
});

export const insertSearchSchema = createInsertSchema(searches).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
