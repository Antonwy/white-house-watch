import { NextResponse } from "next/server";
import { scrapeAllArticles } from "@/lib/scraping/wh-scraper";
import { insertArticle } from "@/lib/db/actions/insert-articles";
import { generateEmbeddings } from "@/lib/vectors/generate-embeddings";
import { insertEmbeddings } from "@/lib/db/actions/insert-embeddings";

export async function POST() {
    const allArticles = await scrapeAllArticles();
    
    console.log(`Successfully scraped ${allArticles.length} articles`);

    for (const article of allArticles) {
        try {
            const { articleId, resourceId } = await insertArticle(article);
            console.log(`Inserted article: ${article.title} with id: ${articleId} and resource id: ${resourceId}`);

            const embeddings = await generateEmbeddings(article.content);
            console.log(`Generated ${embeddings.length} embeddings for article: ${article.title}`);

            await insertEmbeddings(resourceId, embeddings);
            console.log(`Inserted ${embeddings.length} embeddings for article: ${article.title}`);
        } catch (error) {
            console.error(`Failed to insert article: ${article.title}`, error);
        }
    }

    return NextResponse.json({
        success: true,
        message: `Successfully scraped and inserted ${allArticles.length} articles`
    });
}
