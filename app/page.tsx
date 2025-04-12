import db from '@/lib/db/db';
import { articlesSchema } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function Home() {
  const articles = await db
    .select()
    .from(articlesSchema)
    .limit(10)
    .orderBy((t) => desc(t.publishedAt));

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center">
      <header className="flex items-center justify-center p-4">
        <Link href="/" className="flex flex-col items-center gap-4">
          <Image
            src="/whitehouse-logo.webp"
            alt="Whitehouse Logo"
            width={120}
            height={120}
          />

          <h1 className="text-xl font-bold text-whitehouse font-[family-name:var(--font-geist-sans)]">
            WHITEHOUSE WATCH
          </h1>
        </Link>
      </header>

      <section className="w-full max-w-2xl flex flex-col items-center gap-2 px-4">
        <form className="relative w-full h-24 rounded-lg bg-muted/40 border border-muted overflow-hidden focus-within:border-whitehouse/20 transition-colors">
          <input
            type="text"
            placeholder="Ask the Whitehouse"
            className="w-full h-1/2 p-4 outline-none focus:ring-0 border-none"
          />

          <Button
            className="absolute right-3 bottom-3 rounded-full p-2"
            type="submit"
            size="icon"
          >
            <SearchIcon className="size-4" />
          </Button>
        </form>

        <span className="text-xs text-muted-foreground text-center px-2">
          Whitehouse Watch can make mistakes. Check the original source for more
          information.
        </span>
      </section>

      <section className="flex flex-row gap-2 md:gap-4 w-full pb-4 overflow-x-auto mt-8 md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] no-scrollbar">
        {articles.map((article, index) => (
          <Link
            href={`/articles/${article.id}`}
            key={article.id}
            className={cn(
              'p-4 min-w-72 w-72 h-30 flex-shrink-0 border border-muted rounded-lg hover:bg-muted/50 transition-colors',
              index === 0 &&
                'ml-4 md:ml-[calc(((100%-var(--container-2xl))/2)+var(--spacing)*4)]',
              index === articles.length - 1 &&
                'mr-4 md:mr-[calc(((100%-var(--container-2xl))/2)+var(--spacing)*4)]'
            )}
          >
            <h2 className="text-sm font-bold line-clamp-3">{article.title}</h2>

            <div className="flex flex-row gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground bg-muted/50 border border-muted rounded-sm px-1.5 py-1">
                {article.publishedAt.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted/50 border border-muted rounded-sm px-1.5 py-1">
                {article.category}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
