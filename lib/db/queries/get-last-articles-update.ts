import { desc, eq } from "drizzle-orm";
import db from "../db";
import { cronMetadataSchema } from "../schema";

export async function getLastArticlesUpdate() {
  const lastArticlesUpdate = await db.query.cronMetadataSchema.findFirst({
    where: eq(cronMetadataSchema.cronType, 'article-updates'),
    orderBy: desc(cronMetadataSchema.lastRun),
  });

  return lastArticlesUpdate;
}