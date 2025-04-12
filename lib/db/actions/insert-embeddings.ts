import { Embedding } from "@/lib/types";
import db from "../db";
import { embeddingsSchema } from "../schema";

export const insertEmbeddings = async (resourceId: string, embeddings: Embedding[]): Promise<void> => {
  for (const embedding of embeddings) {
    await db.insert(embeddingsSchema).values({
      embedding: embedding.embedding,
      content: embedding.content,
      resourceId: resourceId
    });
  }
}
