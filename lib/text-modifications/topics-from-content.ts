import { openai } from '../openai';
import { PoliticalTopic, politicalTopics } from '../data/political-topics';
import { Article } from '../db/schema';

export async function topicsFromContent(
  content: string,
): Promise<Article['topics']> {
  const topicsString = politicalTopics.join(', ');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant that identifies relevant political topics for a given text. Analyze the content and select a maximum of 3 topics from the following list that best represent the main themes: ${topicsString}. Respond with a JSON object containing an array of strings named "topics". For example: {"topics": ["Economy", "Trade"]}`,
      },
      {
        role: 'user',
        content: `Identify the top 1-3 relevant political topics for the following content:

Content: ${content}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');

  const validTopics = result.topics.filter((topic: string) =>
    politicalTopics.includes(topic as PoliticalTopic)
  );

  return validTopics;
};
