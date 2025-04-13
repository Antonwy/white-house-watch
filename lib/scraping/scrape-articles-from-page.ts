import { load } from "cheerio";
import { buildPaginatedUrl } from "./build-paginated-url";
import { delay } from "../utils";
import { scrapeArticle } from "./scrape-article";
import { FullInsertArticle } from "../types";

export async function scrapeArticlesFromPage(pageNumber: number) {
  try {
    console.log(`Fetching page ${pageNumber}...`);
    const pageHtml = await fetch(buildPaginatedUrl(pageNumber)).then(res => res.text());
    const $ = load(pageHtml);

    const main = $("main");
    const ul = main.find("ul").eq(2);
    const liTags = ul.find("li");

    const articlePromises = liTags.map(async (index, element) => {
        const $element = $(element);
        const linkElement = $element.find("a");
        const link = linkElement.attr("href");

        if (!link) {
            console.warn(`Skipping item at index ${index} on page ${pageNumber} due to missing link.`);
            return null;
        }
        await delay(100);
        return await scrapeArticle(link);
    }).get();

    const articlesFromPage = await Promise.all(articlePromises);
    await delay(200);
    return articlesFromPage.filter((article): article is FullInsertArticle => article !== null);
  } catch (error) {
      console.error(`Failed to process page ${pageNumber}:`, error);
      return [];
  }
}

