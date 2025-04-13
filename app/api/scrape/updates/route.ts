import { NextResponse } from "next/server";
import { insertArticle } from "@/lib/db/actions/insert-articles";
import { generateEmbeddings } from "@/lib/vectors/generate-embeddings";
import { insertEmbeddings } from "@/lib/db/actions/insert-embeddings";
import { scrapeNewArticles } from "@/lib/scraping/scrape-new-articles";
import { formatContentMarkdown } from "@/lib/text-improvements/format-content-markdown";
import { improveTitleAndCreateShortDescription } from "@/lib/text-improvements/improve-title-and-short-description";

export const maxDuration = 60 * 10; // 10 minutes

export async function POST() {
    const newArticles = await scrapeNewArticles();
    
    console.log(`Successfully scraped ${newArticles.length} new articles`);

    for (const article of newArticles) {
        try {
            const { title, shortDescription } = await improveTitleAndCreateShortDescription(article.title, article.content);
            const formattedContent = await formatContentMarkdown(article.content);

            const newArticle = {
                ...article,
                title,
                shortDescription,
                content: formattedContent
            }

            const { articleId, resourceId } = await insertArticle(newArticle);
            console.log(`Inserted article: ${newArticle.title} with id: ${articleId} and resource id: ${resourceId}`);

            const embeddings = await generateEmbeddings(formattedContent);
            console.log(`Generated ${embeddings.length} embeddings for article: ${newArticle.title}`);

            await insertEmbeddings(resourceId, embeddings);
            console.log(`Inserted ${embeddings.length} embeddings for article: ${newArticle.title}`);
        } catch (error) {
            console.error(`Failed to insert article: ${article.title}`, error);
        }
    }

    return NextResponse.json({
        success: true,
        message: `Successfully scraped and inserted ${newArticles.length} new articles`
    });
}
