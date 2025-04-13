'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn, formatDate } from '@/lib/utils';
import Tag from './tag';
import { Resource } from '@/lib/db/schema';
import { useState } from 'react';
import { getResource } from '@/lib/db/queries/get-resource';
import { Markdown } from './markdown';
import { Button } from './ui/button';
import { FileTextIcon, Loader2, XIcon } from 'lucide-react';

type Props = {
  resourceId: string | null;
  title: string;
  publishedAt: string | Date;
  category: string;
  shortDescription: string | null;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={cn('text-left', className)}>
        {children}
      </DialogTrigger>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="bg-muted p-6 sticky top-0">
          <DialogTitle>{title}</DialogTitle>
          {shortDescription && (
            <DialogDescription>{shortDescription}</DialogDescription>
          )}
        </DialogHeader>

        {resource && (
          <div className="text-sm px-6 pb-6">
            <Markdown>{resource?.content}</Markdown>
          </div>
        )}

        <section
          className={cn(
            'flex gap-2 justify-between p-6 sticky bottom-0 bg-background',
            resource && 'border-t pt-6'
          )}
        >
          <div className="flex flex-row gap-2 items-center">
            <Tag>{category}</Tag>
            <Tag>{formattedPublishedAt}</Tag>
          </div>

          <div className="flex flex-row justify-end gap-2">
            {resourceId && !resource && (
              <Button
                variant="secondary"
                onClick={() => fetchResource(resourceId)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Load more
                  </>
                ) : (
                  <>
                    <FileTextIcon className="w-4 h-4" />
                    Load more
                  </>
                )}
              </Button>
            )}

            <Button onClick={() => setIsOpen(false)}>
              <XIcon className="w-4 h-4" />
              Close
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

export default ArticleDialog;
