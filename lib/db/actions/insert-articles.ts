import { FullInsertArticle } from "@/lib/types";
import db from "../db";
import { articlesSchema, resourcesSchema } from "../schema";

export const insertArticle = async ({title, shortDescription, category, link, publishedAt, content, slug, topics}: FullInsertArticle): Promise<{articleId: string, resourceId: string}> => {
  const resource = await db.insert(resourcesSchema).values({ content }).returning();
  const article = await db.insert(articlesSchema).values({ title, shortDescription, category, link, publishedAt, resourceId: resource[0].id, slug, topics }).returning();
  
  return {
    articleId: article[0].id,
    resourceId: resource[0].id
  };
}
