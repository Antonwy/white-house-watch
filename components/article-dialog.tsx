'use client';

import { cn, formatDate } from '@/lib/utils';
import Tag from './tag';
import { Resource } from '@/lib/db/schema';
import { useState } from 'react';
import { getResource } from '@/lib/db/queries/get-resource';
import { Markdown } from './markdown';
import { Button } from './ui/button';
import { FileTextIcon, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from './ui/responsive-drawer-dialog';

type Props = {
  resourceId: string | null;
  title: string;
  publishedAt: string | Date;
  category: string;
  shortDescription: string | null;
  topics: string[] | null;
  children: React.ReactNode;
  className?: string;
};

function ArticleDialog({
  resourceId,
  title,
  publishedAt,
  category,
  shortDescription,
  children,
  className,
  topics,
}: Props) {
  const formattedPublishedAt = formatDate(publishedAt);
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchResource = async (resourceId: string) => {
    setIsLoading(true);
    const resource = await getResource(resourceId);
    setResource(resource);
    setIsLoading(false);
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger className={cn('text-left', className)}>
        {children}
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="flex flex-col !max-w-2xl max-h-[90dvh] overflow-hidden p-0 gap-0">
        <ResponsiveDialogHeader className="md:bg-muted p-6">
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          {shortDescription && (
            <ResponsiveDialogDescription>
              {shortDescription}
            </ResponsiveDialogDescription>
          )}

          <div className="flex flex-row flex-wrap gap-2 items-center mt-2">
            {topics?.map((topic) => (
              <Tag key={topic} className="bg-zinc-200 border-zinc-300">
                {topic}
              </Tag>
            ))}
          </div>
        </ResponsiveDialogHeader>

        {resource && (
          <ScrollArea className="text-sm px-6 pb-6 grow overflow-y-auto">
            <Markdown>{resource?.content}</Markdown>
          </ScrollArea>
        )}

        <section
          className={cn(
            'flex gap-2 justify-between p-6 bg-background flex-col md:flex-row items-center',
            resource && 'border-t pt-6'
          )}
        >
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <Tag>{category}</Tag>
            <Tag>{formattedPublishedAt}</Tag>
          </div>

          <div className="flex flex-row justify-end gap-2 md:flex w-full md:w-auto">
            {resourceId && !resource && (
              <Button
                variant="secondary"
                onClick={() => fetchResource(resourceId)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Load more
                  </>
                ) : (
                  <>
                    <FileTextIcon />
                    Load more
                  </>
                )}
              </Button>
            )}

            <Button className="grow md:grow-0" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </section>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

export default ArticleDialog;
