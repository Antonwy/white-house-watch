import { findRecentArticles } from "../db/queries/find-recent-articles";
import { FullInsertArticle } from "../types";
import { scrapeArticlesFromPage } from "./scrape-articles-from-page";

export async function scrapeNewArticles(): Promise<FullInsertArticle[]> {
  const recentArticles = await findRecentArticles();
  const recentArticleSlugs = new Set(recentArticles.map((a) => a.slug));

  const allNewArticles: FullInsertArticle[] = [];
  let page = 1;

  while (true) {
    console.log(`Scraping page ${page}...`);
    const scrapedArticles = await scrapeArticlesFromPage(page);

    if (scrapedArticles.length === 0) {
      console.log("Found no articles on page, stopping.");
      break;
    }

    let foundOverlap = false;
    const newArticlesOnPage: FullInsertArticle[] = [];

    for (const article of scrapedArticles) {
      if (recentArticleSlugs.size > 0 && recentArticleSlugs.has(article.slug)) {
        console.log(`Found overlapping article with slug: ${article.slug}. Stopping further scraping.`);
        foundOverlap = true;
        break;
      } else {
        if (!recentArticleSlugs.has(article.slug)) {
             newArticlesOnPage.push(article);
        }
      }
    }

    allNewArticles.push(...newArticlesOnPage);

    if (foundOverlap) {
      break;
    }

    page++;
  }

  console.log(`Found ${allNewArticles.length} new articles.`);
  return allNewArticles;
}