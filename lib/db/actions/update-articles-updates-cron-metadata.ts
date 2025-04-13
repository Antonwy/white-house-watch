import db from "../db";
import { cronMetadataSchema } from "../schema";

export async function updateArticleUpdatesCronMetadata(newArticlesCount: number) {
  await db.insert(cronMetadataSchema).values({
    cronType: 'article-updates',
    newArticlesCount,
    lastRun: new Date()
  });
}

