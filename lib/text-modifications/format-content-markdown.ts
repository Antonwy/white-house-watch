import { openai } from "../openai";

export async function formatContentMarkdown (
  content: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that formats text content using Markdown. Use elements like headlines, bold text, lists, etc., where appropriate to improve readability. Remove any initial heading text such as categories, article titles, sources, or dates (e.g., "Articles", "The White House", "April 11, 2025"). Also remove any irrelevant, incorrect, or placeholder content such as "loading...", broken links, or mentions of social media platforms like "x.com" that do not belong in the article body. Do not rewrite or change the actual body content, only apply formatting and remove these unwanted elements. Respond only with the formatted Markdown content.',
      },
      {
        role: 'user',
        content: `Format the following content using Markdown:

${content}`,
      },
    ],
  });

  const result = response.choices[0].message.content;
  if (!result) {
    throw new Error('No content received from OpenAI');
  }

  return result;
};