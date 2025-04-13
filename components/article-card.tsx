import { cn, formatDate } from '@/lib/utils';
import ArticleDialog from './article-dialog';
import Tag from './tag';

type Props = {
  resourceId: string | null;
  title: string;
  publishedAt: Date | string;
  category: string;
  shortDescription: string | null;
  topics: string[] | null;
  className?: string;
};

export default function ArticleCard({
  resourceId,
  title,
  publishedAt,
  shortDescription,
  category,
  topics,
  className,
}: Props) {
  const formattedPublishedAt = formatDate(publishedAt);

  return (
    <ArticleDialog
      resourceId={resourceId}
      title={title}
      publishedAt={publishedAt}
      category={category}
      shortDescription={shortDescription}
      topics={topics}
      className={cn(
        'p-4 min-w-72 w-72 h-30 flex-shrink-0 border border-muted rounded-lg hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <h2 className="text-sm font-bold line-clamp-3">{title}</h2>

      <div className="flex flex-row gap-2 mt-1">
        <Tag>{formattedPublishedAt}</Tag>
        <Tag>{category}</Tag>
      </div>
    </ArticleDialog>
  );
}
