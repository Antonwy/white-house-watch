import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import db from "../db";
import { embeddingsSchema } from "../schema";
import { generateEmbedding } from "@/lib/vectors/generate-embeddings";

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsSchema.embedding,
    userQueryEmbedded.embedding,
  )})`;
  
  const similarGuides = await db
    .select({ name: embeddingsSchema.content, similarity })
    .from(embeddingsSchema)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};