import { ToolInvocation } from "ai";
import { Article, InsertArticle } from "./db/schema";

export type FullInsertArticle = InsertArticle & {
  content: string;
}

export type Embedding = {
  embedding: number[];
  content: string;
}

export type MessageGroup = {
  question: string;
  answer?: string;
  toolInvocations?: ToolInvocation[];
  id: number;
  loading: boolean;
}

export type GetInformationToolResult = {
  name: string;
  similarity: number;
  resourceId: string;
  article?: Article;
}