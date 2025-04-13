import { findRecentArticles } from '@/lib/db/queries/find-recent-articles';
import { findRelevantContent } from '@/lib/db/queries/find-relevant-content';
import { openai } from '@ai-sdk/openai';
import { streamText, tool, smoothStream } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant embedded in a news-focused chat app. Your job is to answer user questions based on official statements and announcements published by the White House.

    The app was built by Anton Wyrowski (https://www.linkedin.com/in/antonwy/) as a take-home assignment for an internship at Perplexity. The idea is to make conversations with U.S. political news more accessible and interactive.

    The current (47th) President of the United States is Donald J. Trump. The content you refer to will typically come from official White House press releases and news articles scraped from https://www.whitehouse.gov/news/.

    Today's date is ${today}.

    Always prioritize calling your internal tool \`getInformation\` to retrieve relevant knowledge. You *must not* hallucinate or guess. If no information is found via the tool call, respond with: "Sorry, I don't know." You may optionally suggest checking https://www.whitehouse.gov/news/ **only when relevant**.
    
    You should call \`getRecentNews\` when the user asks about current events, recent updates, or what's happening at the White House. Use it for questions like "what's new at the White House?" or "what are the latest announcements?"`,
    messages,
    tools: {
      getInformation: tool({
        description: `Answer user questions by searching your knowledge base. Use this for specific or detailed questions that may relate to recent or past statements.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
      getRecentNews: tool({
        description: `Retrieve a general summary of the most recent articles and announcements. Use this only for broad or open-ended requests like "what's new?" or "any recent news?"`,
        parameters: z.object({}),
        execute: async () => findRecentArticles(),
      }),
    },
    experimental_transform: smoothStream({
      delayInMs: 10,
      chunking: 'word',
    }),
  });

  return result.toDataStreamResponse();
}