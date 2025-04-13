import db from '@/lib/db/db';
import { eq } from 'drizzle-orm';
import { articlesSchema } from '@/lib/db/schema';
import WhitehouseWatchLogo from '@/components/whitehouse-watch-logo';
import { Markdown } from '@/components/markdown';
import ChatInput from '@/components/chat-input';
type Props = {
  params: Promise<{ articleId: string }>;
};

async function ArticlePage({ params }: Props) {
  const { articleId } = await params;

  const article = await db.query.articlesSchema.findFirst({
    where: eq(articlesSchema.id, articleId),
    with: {
      resource: true,
    },
  });

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <main className="relative p-4">
      <section className="flex items-center justify-center p-4">
        <WhitehouseWatchLogo />
      </section>

      <section className="w-full max-w-2xl mx-auto flex flex-col gap-2 mt-8">
        <h1 className="text-2xl font-bold">{article?.title}</h1>
        <p className="text-sm text-muted-foreground">
          {article?.shortDescription}
        </p>

        <span className="border-b border-gray-200 w-full my-4" />

        {article?.resource?.content && (
          <Markdown>{article?.resource?.content}</Markdown>
        )}
      </section>

      <section className="sticky bottom-4 left-0 right-0 w-full max-w-2xl mx-auto flex flex-col gap-2 mt-8">
        <div className="-mx-4">
          <ChatInput withShadow withFactCheck />
        </div>
      </section>
    </main>
  );
}

export default ArticlePage;
