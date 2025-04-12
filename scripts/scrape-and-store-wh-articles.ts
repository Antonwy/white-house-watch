
import { scrapeAllArticles } from "../lib/scraping/wh-scraper";
import { insertArticle } from "../lib/db/actions/insert-articles";

const allArticles = await scrapeAllArticles();

for (const article of allArticles) {
  try {
      const { articleId, resourceId } = await insertArticle(article);
      console.log(`Inserted article: ${article.title} with id: ${articleId} and resource id: ${resourceId}`);
  } catch (error) {
      console.error(`Failed to insert article: ${article.title}`, error);
  }
}