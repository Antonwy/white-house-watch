import db from "@/lib/db/db";
import { resourcesSchema } from "@/lib/db/schema";
import { generateEmbeddings } from "../lib/vectors/generate-embeddings";
import { insertEmbeddings } from "../lib/db/actions/insert-embeddings";

const resources = await db.select().from(resourcesSchema);

for (const resource of resources) {
    const embeddings = await generateEmbeddings(resource.content);
    console.log(`Generated ${embeddings.length} embeddings for resource: ${resource.id}`);

    await insertEmbeddings(resource.id, embeddings);
    console.log(`Inserted ${embeddings.length} embeddings for resource: ${resource.id}`);
}
