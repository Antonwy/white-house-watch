import db from '@/lib/db/db';
import { eq } from 'drizzle-orm';
import { articlesSchema } from '@/lib/db/schema';
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
    <section className="p-4">
      <h1 className="text-2xl font-bold">{article?.title}</h1>
      <p className="text-sm text-gray-500">{article?.shortDescription}</p>

      <div className="mt-4">
        <p className="text-sm text-gray-500">{article?.resource?.content}</p>
      </div>
    </section>
  );
}

export default ArticlePage;
