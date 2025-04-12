import { embed, embedMany } from 'ai';
// import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { Embedding } from '../types';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

// const embeddingModel = google.textEmbeddingModel('gemini-embedding-exp-03-07');
const embeddingModel = openai.textEmbeddingModel('text-embedding-3-large');

const generateChunks = async (input: string): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ['\n\n', '\n', '. ', '? ', '! ', ' ', ''],
  });

  const chunks = await splitter.splitText(input);
  return chunks.filter((chunk: string) => chunk.trim().length > 0);
};

export const generateEmbeddings = async (
  value: string,
): Promise<Embedding[]> => {
  const chunks = await generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<Embedding> => {
  const { embedding } = await embed({
    model: embeddingModel,
    value,
  });
  return { content: value, embedding };
};