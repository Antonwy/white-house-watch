import db from '@/lib/db/db';
import { articlesSchema } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { cn } from '@/lib/utils';
import WhitehouseWatchLogo from '@/components/whitehouse-watch-logo';
import ChatInput from '@/components/chat-input';
import ArticleCard from '@/components/article-card';
import { quickReplies } from '@/lib/data/quick-replies';

export default async function Home() {
  const articles = await db
    .select()
    .from(articlesSchema)
    .limit(10)
    .orderBy((t) => desc(t.publishedAt));

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center">
      <section className="flex items-center justify-center p-4">
        <WhitehouseWatchLogo />
      </section>

      <section className="w-full max-w-2xl flex flex-col items-center gap-2 px-4">
        <ChatInput quickReplies={quickReplies.slice(0, 10)} />

        <span className="text-xs text-muted-foreground text-center px-2">
          Whitehouse Watch can make mistakes. Check the original source for more
          information.
        </span>
      </section>

      <section className="flex flex-row gap-2 md:gap-4 w-full pb-4 overflow-x-auto mt-8 md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] no-scrollbar">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            resourceId={article.resourceId}
            title={article.title}
            publishedAt={article.publishedAt}
            category={article.category}
            shortDescription={article.shortDescription}
            className={cn(
              index === 0 &&
                'ml-4 md:ml-[calc(((100%-var(--container-2xl))/2)+var(--spacing)*4)]',
              index === articles.length - 1 &&
                'mr-4 md:mr-[calc(((100%-var(--container-2xl))/2)+var(--spacing)*4)]'
            )}
          />
        ))}
      </section>
    </main>
  );
}
