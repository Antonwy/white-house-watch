import { InsertArticle } from "./db/schema";

export type FullInsertArticle = InsertArticle & {
  content: string;
}

export type Embedding = {
  embedding: number[];
  content: string;
}