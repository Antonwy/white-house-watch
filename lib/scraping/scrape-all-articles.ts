import { load } from "cheerio";
import { FullInsertArticle } from "../types";
import { scrapePagination } from "./scrape-pagination";
import { scrapeArticlesFromPage } from "./scrape-articles-from-page";
import { buildPaginatedUrl } from "./build-paginated-url";


export const scrapeAllArticles = async (): Promise<FullInsertArticle[]> => {
  const firstPageHtml = await fetch(buildPaginatedUrl(1)).then(res => res.text());
  const $firstPage = load(firstPageHtml);

  const lastPageNumber = scrapePagination($firstPage);

  console.log(`Found ${lastPageNumber} pages to scrape`);

  const pageNumbers = Array.from({ length: lastPageNumber }, (_, i) => i + 1);

  const resultsPerPage = await Promise.all(
      pageNumbers.map(async (pageNumber) => {
          const articles = await scrapeArticlesFromPage(pageNumber);
          return articles;
      })
  );

  return resultsPerPage.flat();
}
