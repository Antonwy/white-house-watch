import { load } from "cheerio";
import { FullInsertArticle } from "../types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const WHITE_HOUSE_NEWS_URL = "https://www.whitehouse.gov/news";

const buildPaginatedUrl = (pageNumber: number) => {
    return `${WHITE_HOUSE_NEWS_URL}/page/${pageNumber}/`;
}

export const scrapeAllArticles = async (): Promise<FullInsertArticle[]> => {
  const firstPageHtml = await fetch(buildPaginatedUrl(1)).then(res => res.text());
  const $firstPage = load(firstPageHtml);

  const pagination = $firstPage("nav[aria-label='Pagination']");
  const paginationNumbers = pagination.find(".wp-block-query-pagination-numbers");
  const pageLinks = paginationNumbers.find("a");
  const lastPageNumberString = pageLinks.last().text();
  const lastPageNumber = parseInt(lastPageNumberString) || 1;

  console.log(`Found ${lastPageNumber} pages to scrape`);

  const pageNumbers = Array.from({ length: lastPageNumber }, (_, i) => i + 1);

  const resultsPerPage = await Promise.all(
      pageNumbers.map(async (pageNumber) => {
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
      })
  );

  return resultsPerPage.flat();
}

export const scrapeArticle = async (link: string): Promise<FullInsertArticle | null> => {
    try {
        const html = await fetch(link).then(res => res.text());
        const $ = load(html);

        const title = $('h1.wp-block-whitehouse-topper__headline').text().trim();

        let category = '';
        const categoryLink = $('.wp-block-whitehouse-byline-subcategory__link');
        if (categoryLink.length > 0) {
            category = categoryLink.text().trim();
        } else {
            const categoryDiv = $('.wp-block-whitehouse-topper__meta--byline-subcategory .wp-block-whitehouse-byline-subcategory');
             if (categoryDiv.length > 0) {
                 category = categoryDiv.text().trim();
            }
        }

        const publishedAt = $('.wp-block-post-date time').attr('datetime');

        const $entryContent = $('div.entry-content');
        const contentBlocks = $entryContent.children()
            .map((i, el) => $(el).text().trim())
            .get()
            .filter(text => text.length > 0);
        const content = contentBlocks.join('\n\n');

        if (!content) {
          console.warn(`No content found for article: ${link}`);
          return null;
        }

        if (!title) {
             console.warn(`No title found for article: ${link}`);
             return null;
        }

        if (!publishedAt) {
            console.warn(`No published date found for article: ${link}`);
            return null;
        }

        const slug = generateSlug(title, publishedAt);

        if (!slug) {
            console.warn(`Could not generate slug for article: ${title} (${link})`);
            return null;
        }

         if (!content && contentBlocks.length === 0) {
             console.warn(`No content blocks found for article: ${title} (${link})`);
         }

         const publishedAtDate = new Date(publishedAt);

        return {
            link,
            slug,
            title,
            category,
            publishedAt: publishedAtDate,
            content
        };
    } catch (error) {
        console.error(`Failed to scrape article: ${link}`, error);
        return null;
    }
}

const generateSlug = (title: string, publishedAt: string): string => {
  const datePart = publishedAt.split('T')[0]; // Extract YYYY-MM-DD
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${datePart}-${titleSlug}`;
};