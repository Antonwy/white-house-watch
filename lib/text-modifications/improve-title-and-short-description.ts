import { openai } from '../openai';
import { ImprovedHeading } from '../types';

export async function improveTitleAndCreateShortDescription(
  title: string,
  content: string,
): Promise<ImprovedHeading> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that improves the title and creates a short description for a news article based on its existing title and content. Your goal is to make the title and description engaging for readers. Respond with a JSON object containing the improved `title` and a concise `shortDescription`.',
      },
      {
        role: 'user',
        content: `Improve the title and create an engaging, concise short description for the following news article:

Original Title: ${title}

Content: ${content}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const result = response.choices[0].message.content;
  if (!result) {
    throw new Error('No content received from OpenAI');
  }

  return JSON.parse(result) as ImprovedHeading;
};
