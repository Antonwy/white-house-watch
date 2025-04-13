import { cn } from '@/lib/utils';
import { Markdown } from './markdown';
import { AnimatePresence, motion } from 'motion/react';
import { TextLoop } from './ui/text-loop';
import { ToolInvocation } from 'ai';
import { GetInformationToolResult } from '@/lib/types';
import { useMemo } from 'react';
import ArticleCard from './article-card';
import { Article } from '@/lib/db/schema';

type Props = {
  question: string;
  answer?: string;
  toolInvocations?: ToolInvocation[];
  isFirst?: boolean;
  isLast?: boolean;
  loading?: boolean;
};

const MotionArticleCard = motion.create(ArticleCard);

function MessageGroup({
  question,
  answer,
  toolInvocations,
  isFirst,
  isLast,
  loading,
}: Props) {
  const referenceArticles = useMemo<Article[] | undefined>(
    () =>
      toolInvocations
        ?.map((toolInvocation) => {
          if (toolInvocation.state !== 'result') {
            return undefined;
          }

          switch (toolInvocation.toolName) {
            case 'getInformation':
              return toolInvocation.result.map(
                (result: GetInformationToolResult) => result.article as Article
              );
            case 'getRecentNews':
              return toolInvocation.result;
          }
        })
        .flat()
        .filter(
          (article, index, self) =>
            article && self.findIndex((a) => a?.id === article.id) === index
        ),
    [toolInvocations]
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        isFirst && 'pt-8',
        isLast && 'pb-8',
        !isLast && 'border-b border-muted mb-4 pb-4'
      )}
    >
      <motion.h1
        className="text-lg font-bold px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {question}
      </motion.h1>

      <div className="relative py-3">
        <AnimatePresence>
          {!answer && (
            <motion.div
              className="absolute inset-0 px-4"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ delay: 0.5 }}
            >
              <TextLoop className="text-sm text-muted-foreground">
                <span>Searching documents...</span>
                <span>Analyzing relevant information...</span>
                <span>Retrieving knowledge base...</span>
                <span>Processing your query...</span>
                <span>Finding the best answers...</span>
              </TextLoop>
            </motion.div>
          )}
        </AnimatePresence>

        {answer && (
          <motion.article
            className="text-sm px-4"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Markdown>{answer}</Markdown>
          </motion.article>
        )}

        <AnimatePresence>
          {!loading && (
            <motion.div
              className="flex gap-2 mt-4 overflow-x-auto no-scrollbar"
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.25 },
                },
                hidden: { opacity: 0, y: 5 },
              }}
              initial="hidden"
              animate="visible"
            >
              {referenceArticles?.map((article, index) => (
                <MotionArticleCard
                  key={article?.id}
                  resourceId={article?.resourceId}
                  title={article?.title}
                  publishedAt={article?.publishedAt}
                  category={article?.category}
                  shortDescription={article?.shortDescription}
                  topics={article?.topics}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 5 },
                  }}
                  className={cn(
                    'px-4',
                    index === 0 && 'ml-4',
                    index === referenceArticles.length - 1 && 'mr-4'
                  )}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MessageGroup;
