'use client';

import { useChat } from '@ai-sdk/react';
import ChatInput from './chat-input';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useScrollToBottom } from '@/lib/hooks';
import MessageGroup from './message-group';
import { MessageGroup as MessageGroupType } from '@/lib/types';
import { quickReplies } from '@/lib/data/quick-replies';

type Props = {
  query: string;
};

function ChatView({ query }: Props) {
  const { messages, append, status } = useChat({
    maxSteps: 5,
    initialInput: query,
  });
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [currentQuickReplies, setCurrentQuickReplies] = useState<string[]>(
    quickReplies.slice(0, 5)
  );
  const [usedQuickReplies, setUsedQuickReplies] = useState<string[]>([]);
  const initialQueryAdded = useRef<boolean>(false);

  const appendUserMessage = useCallback(
    (value: string) => {
      append({ role: 'user', content: value });
    },
    [append]
  );

  const handleQuickReplyClick = useCallback(
    (value: string) => {
      append({ role: 'user', content: value });
      setUsedQuickReplies((prev) => [...prev, value]);
    },
    [append]
  );

  useEffect(() => {
    if (initialQueryAdded.current) return;

    appendUserMessage(query);
    initialQueryAdded.current = true;
  }, [query, appendUserMessage, initialQueryAdded]);

  useEffect(() => {
    if (status !== 'ready') return;

    setCurrentQuickReplies(
      quickReplies
        .filter((reply) => !usedQuickReplies.includes(reply))
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
    );
  }, [status, usedQuickReplies]);

  // group messages into question/answer pairs
  const messageGroups = useMemo(() => {
    return messages.reduce((acc, message, index) => {
      if (message.role === 'user') {
        const answer =
          index + 1 < messages.length &&
          messages[index + 1].role === 'assistant'
            ? messages[index + 1]
            : null;

        const messageStatus =
          index === messages.length - 2 && answer ? status !== 'ready' : false;
        const questionAnswer = {
          question: message.content,
          answer: answer?.content ?? '',
          toolInvocations: answer?.parts
            ?.filter((part) => part.type === 'tool-invocation')
            .map((part) => part.toolInvocation),
          id: index,
          loading: messageStatus,
        };

        acc.push(questionAnswer);
      }
      return acc;
    }, [] as Array<MessageGroupType>);
  }, [messages, status]);

  return (
    <section className="relative grow w-full flex flex-col overflow-y-hidden">
      <div
        ref={messagesContainerRef}
        className="grow max-w-2xl mx-auto w-full overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      >
        {messageGroups.map((group, index) => (
          <MessageGroup
            key={group.id}
            question={group.question}
            answer={group.answer}
            toolInvocations={group.toolInvocations}
            isFirst={index === 0}
            isLast={index === messageGroups.length - 1}
            loading={group.loading}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <section className="max-w-2xl px-4 mx-auto w-full flex-shrink-0 pb-4">
        <ChatInput
          withShadow
          onSubmit={appendUserMessage}
          disabled={status !== 'ready'}
          quickReplies={currentQuickReplies}
          onQuickReplyClick={handleQuickReplyClick}
        />
      </section>
    </section>
  );
}

export default ChatView;
