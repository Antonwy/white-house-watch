import { scrapeNewArticles } from "../lib/scraping/scrape-new-articles";

const newArticles = await scrapeNewArticles();

console.log(newArticles);

