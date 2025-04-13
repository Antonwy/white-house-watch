import db from "../db";
import { articlesSchema } from "../schema";
import { desc } from "drizzle-orm";

export const findRecentArticles = async () => {
  const articles = await db.select().from(articlesSchema)
    .orderBy(desc(articlesSchema.publishedAt)).limit(5);

  const result = articles.map(article => ({
    ...article,
    publishedAt: article.publishedAt.toISOString(),
  }));

  return result;
};
