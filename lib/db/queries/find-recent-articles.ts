import db from "../db";
import { articlesSchema } from "../schema";
import { desc } from "drizzle-orm";

export const findRecentArticles = async (limit: number = 5) => {
  const articles = await db.select().from(articlesSchema)
    .orderBy(desc(articlesSchema.publishedAt)).limit(limit);

  return articles;
};
