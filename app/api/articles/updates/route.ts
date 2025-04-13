import { NextResponse } from "next/server";
import { insertArticle } from "@/lib/db/actions/insert-articles";
import { generateEmbeddings } from "@/lib/vectors/generate-embeddings";
import { insertEmbeddings } from "@/lib/db/actions/insert-embeddings";
import { scrapeNewArticles } from "@/lib/scraping/scrape-new-articles";
import { formatContentMarkdown } from "@/lib/text-modifications/format-content-markdown";
import { improveTitleAndCreateShortDescription } from "@/lib/text-modifications/improve-title-and-short-description";
import { updateArticleUpdatesCronMetadata } from "@/lib/db/actions/update-articles-updates-cron-metadata";
import { topicsFromContent } from "@/lib/text-modifications/topics-from-content";
import { FullInsertArticle } from "@/lib/types";
import { notifySubscribers } from "@/lib/notifications/notify-subscribers";
import { PoliticalTopic } from "@/lib/data/political-topics";

export async function POST() {
    const newArticles = await scrapeNewArticles();
    
    console.log(`Successfully scraped ${newArticles.length} new articles`);

    const newArticleIds: string[] = [];

    for (const article of newArticles) {
        try {
            const { title, shortDescription } = await improveTitleAndCreateShortDescription(article.title, article.content);
            const formattedContent = await formatContentMarkdown(article.content);
            const topics = await topicsFromContent(formattedContent);

            const newArticle: FullInsertArticle = {
                ...article,
                title,
                shortDescription,
                content: formattedContent,
                topics: topics as PoliticalTopic[]
            }

            const { articleId, resourceId } = await insertArticle(newArticle);
            console.log(`Inserted article: ${newArticle.title} with id: ${articleId} and resource id: ${resourceId}`);

            newArticleIds.push(articleId);

            const embeddings = await generateEmbeddings(formattedContent);
            console.log(`Generated ${embeddings.length} embeddings for article: ${newArticle.title}`);

            await insertEmbeddings(resourceId, embeddings);
            console.log(`Inserted ${embeddings.length} embeddings for article: ${newArticle.title}`);
        } catch (error) {
            console.error(`Failed to insert article: ${article.title}`, error);
        }
    }

    await updateArticleUpdatesCronMetadata(newArticles.length);

    await notifySubscribers(newArticleIds);

    return NextResponse.json({
        success: true,
        message: `Successfully scraped and inserted ${newArticles.length} new articles`
    });
}
