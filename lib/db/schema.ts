import { text, pgTable, uuid, vector, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const articlesSchema = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  shortDescription: text("shortDescription"),
  category: text("category").notNull(),
  link: text("link").notNull(),
  slug: text("slug").notNull().unique(),
  publishedAt: timestamp("publishedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  resourceId: uuid("resourceId").references(() => resourcesSchema.id, { onDelete: 'cascade' }),
})

export type Article = typeof articlesSchema.$inferSelect;
export type InsertArticle = typeof articlesSchema.$inferInsert;

export const embeddingsSchema = pgTable("embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  embedding: vector("embedding", { dimensions: 3072 }).notNull(),
  content: text("content").notNull(),
  resourceId: uuid("resourceId").references(() => resourcesSchema.id, { onDelete: 'cascade' }),
});

export type Embedding = typeof embeddingsSchema.$inferSelect;
export type InsertEmbedding = typeof embeddingsSchema.$inferInsert;

export const resourcesSchema = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Resource = typeof resourcesSchema.$inferSelect;
export type InsertResource = typeof resourcesSchema.$inferInsert;

export const articlesRelations = relations(articlesSchema, ({ one }) => ({
  resource: one(resourcesSchema, {
    fields: [articlesSchema.resourceId],
    references: [resourcesSchema.id],
  }),
}));
