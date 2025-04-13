import { inArray, arrayOverlaps } from "drizzle-orm";
import db from "../db/db";
import { articlesSchema, notifyMeSchema } from "../db/schema";
import { sendEmail } from "./send-email";
import { PoliticalTopic } from "../data/political-topics";
import { buildNewArticleAlertEmail } from "../data/new-article-alert-email-template";

export async function notifySubscribers(newArticleIds: string[]) {
  const articles = await db.query.articlesSchema.findMany({
    where: inArray(articlesSchema.id, newArticleIds),
  });

  const topics = articles
    .map((article) => article.topics)
    .flat()
    .filter((topic) => topic !== null);

  if (topics.length === 0) {
    console.log("No topics found for new articles, skipping subscriber search.");
    return;
  }

  const subscribers = await db.query.notifyMeSchema.findMany({
    where: arrayOverlaps(notifyMeSchema.topics, topics),
  });

  for (const subscriber of subscribers) {
    const subscriberTopicArticles = articles.filter((article) =>
      subscriber.topics?.some((topic) => article.topics?.includes(topic as PoliticalTopic))
    );

    if (subscriberTopicArticles.length === 0) {
      console.log(`No relevant articles found for subscriber ${subscriber.email}, skipping email.`);
      continue;
    }

    const template = buildNewArticleAlertEmail(subscriber.possibleName, 
      subscriberTopicArticles.map((article) => ({ title: article.title, url: article.link })));

    await sendEmail(
      subscriber.email,
      `Whitehouse Watch - New ${subscriberTopicArticles.length ? 'articles' : 'article'} alert`,
      template
    );
  }
}