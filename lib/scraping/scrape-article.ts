import { load } from "cheerio";
import { FullInsertArticle } from "../types";
import { generateSlug } from "./generate-slug";

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