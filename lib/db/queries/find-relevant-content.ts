import { cosineDistance, desc, gt, isNull, not, sql, and, inArray } from "drizzle-orm";
import db from "../db";
import { articlesSchema, embeddingsSchema } from "../schema";
import { generateEmbedding } from "@/lib/vectors/generate-embeddings";
import { openai } from "@/lib/openai";


// type SearchResult = {
//   name: string;
//   similarity: number;
//   resourceId: string;
// };

export const findRelevantContent = async (userQuery: string) => {
  const improvedQuery = await improveQuery(userQuery);

  const userQueryEmbedded = await generateEmbedding(improvedQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsSchema.embedding,
    userQueryEmbedded.embedding,
  )})`;

  const similarGuides = await db
    .select({ name: embeddingsSchema.content, similarity, resourceId: embeddingsSchema.resourceId })
    .from(embeddingsSchema)
    .where(
      and(
        gt(similarity, 0.25),
        not(isNull(embeddingsSchema.resourceId))
      )
    )
    .orderBy(t => desc(t.similarity))
    .limit(10);

  // const reRankedGuides = await reRankEmbeddings(improvedQuery, similarGuides as SearchResult[]);

  // console.log("Re-Ranked Guides:", reRankedGuides);

  const resourceIds = [...new Set(similarGuides.map(r => r.resourceId).filter(Boolean))] as string[];
    
    // For now, we removed the resources, since the context got too long
    // const resources = await db.select({content: resourcesSchema.content, id: resourcesSchema.id}).from(resourcesSchema).where(inArray(resourcesSchema.id, resourceIds));

  const articles = await db.select().from(articlesSchema).where(inArray(articlesSchema.resourceId, resourceIds));

  const result = similarGuides.map(r => ({
    ...r,
    article: articles.find(a => a.resourceId === r.resourceId),
  }));

  return result;
};

const improveQuery = async (userQuery: string) => {
  const systemPrompt = `
    You are an AI assistant specialized in query expansion for a vector database. 
    Given a short user query, do the following:
    1. Identify the main keywords or phrases in the query.
    2. Suggest synonyms or near-synonyms for each keyword that are relevant to the domain.
    3. Generate a concise query string that preserves the meaning of the original query 
       but includes some of these synonyms and related keywords to improve recall.

    Return your answer as valid JSON with a single key "query" containing the improved query string.
  `;

  const userPrompt = `Original User Query: "${userQuery}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    console.error("OpenAI returned empty content.");
    return userQuery;
  }

  try {
    const parsedJson = JSON.parse(content);
    return parsedJson.query;
  } catch (error) {
    console.error("Failed to parse JSON from OpenAI response:", error);
    return userQuery;
  }
};


// const reRankEmbeddings = async (userQuery: string, results: SearchResult[]): Promise<SearchResult[]> => {
//   const resultDescriptions = results.map((r, index) => `${index + 1}. ${r.name} (Similarity: ${r.similarity.toFixed(4)}, ID: ${r.resourceId})`).join('\n');

//   const systemPrompt = `You are an AI assistant tasked with re-ranking search results based on their relevance to a user query. Given a user query and a list of search results (documents/content snippets), evaluate each result's relevance to the query. Return a JSON object containing a single key "results" which holds an array of the results you deem relevant, ordered from most relevant to least relevant. Maintain the original structure of each result object ({ name: string, similarity: number, resourceId: string }). If no results are relevant, return { "results": [] }.`;

//   const userPrompt = `User Query: "${userQuery}"

// Search Results:
// ${resultDescriptions}

// Please re-rank these results based on their relevance to the user query and provide the output as a JSON object with a "results" key containing the array.`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       response_format: { type: "json_object" },
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt },
//       ],
//       temperature: 0.2,
//     });

//     const content = response.choices[0]?.message?.content;
//     if (!content) {
//       console.error("OpenAI returned empty content.");
//       return results;
//     }

//     let rankedResults: SearchResult[] = [];
//     try {
//         const parsedJson = JSON.parse(content);

//         const resultsArray = parsedJson.results;

//         if (Array.isArray(resultsArray)) {
//              if (resultsArray.every(item =>
//                  typeof item.name === 'string' &&
//                  typeof item.similarity === 'number' &&
//                  typeof item.resourceId === 'string'
//              )) {
//                  rankedResults = resultsArray as SearchResult[];
//              } else {
//                  console.error("Parsed array items do not match expected SearchResult structure (including resourceId):", resultsArray);
//                  return results;
//              }
//         } else {
//              console.error("Could not find 'results' array key in OpenAI response or it's not an array:", parsedJson);
//              return results;
//         }
//     } catch (parseError) {
//         console.error("Failed to parse OpenAI response as JSON:", parseError);
//         return results;
//     }

//     return rankedResults;

//   } catch (error) {
//     console.error("Error calling OpenAI for re-ranking:", error);
//     return results;
//   }
// };