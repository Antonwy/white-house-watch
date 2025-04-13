'use client';

import { SearchIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  withShadow?: boolean;
  withFactCheck?: boolean;
  quickReplies?: string[];
  onSubmit?: (value: string) => void;
  onQuickReplyClick?: (value: string) => void;
  disabled?: boolean;
};

function ChatInput({
  withShadow = false,
  withFactCheck = false,
  quickReplies,
  onSubmit,
  onQuickReplyClick,
  disabled = false,
}: Props) {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const value = (formData.get('message') as string).trim();

    if (onSubmit) {
      onSubmit(value);
      setMessage('');
    } else {
      console.log('pushing to chat', value);
      const query = encodeURIComponent(value);
      router.push(`/chat?query=${query}`);
    }
  };

  const handleQuickReplyClick = (value: string) => {
    if (onQuickReplyClick) {
      onQuickReplyClick(value);
    } else {
      const query = encodeURIComponent(value);
      router.push(`/chat?query=${query}`);
    }
  };

  return (
    <form
      className={cn(
        'relative w-full h-24 rounded-lg bg-zinc-50 border border-muted overflow-hidden focus-within:border-whitehouse/20 transition-colors',
        withShadow && 'shadow-2xl border-whitehouse/20',
        quickReplies && 'h-32'
      )}
      onSubmit={handleSubmit}
    >
      {quickReplies && (
        <section className="flex gap-2 overflow-x-auto no-scrollbar pt-2 max-w-full">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              type="button"
              disabled={disabled}
              className={cn(
                'rounded-sm text-[10px] px-2 py-1 border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors flex-shrink-0',
                index === 0 && 'ml-2',
                index === quickReplies.length - 1 && 'mr-2'
              )}
              onClick={() => handleQuickReplyClick(reply)}
            >
              {reply}
            </button>
          ))}
        </section>
      )}

      <input
        type="text"
        placeholder="Ask the Whitehouse"
        name="message"
        className={cn(
          'w-full h-1/2 py-4 px-4 outline-none focus:ring-0 border-none',
          quickReplies && 'h-14'
        )}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="absolute left-3 bottom-3 flex items-center gap-2">
        <Link
          href="/"
          className="w-12 h-8 relative bg-muted/0 hover:bg-muted/70 px-2 transition-colors rounded-sm flex items-center justify-center border border-muted/0 hover:border-muted"
        >
          <Image
            src="/whitehouse-logo.webp"
            alt="Whitehouse Logo"
            width={40}
            height={40}
          />
        </Link>

        {withFactCheck && (
          <button
            type="button"
            className="rounded-sm p-2 flex items-center gap-2 text-xs border border-zinc-200 hover:border-zinc-300 transition-colors bg-zinc-100 hover:bg-zinc-200"
          >
            <ShieldCheckIcon className="size-4" />
            Check Facts
          </button>
        )}
      </div>

      <Button
        className="absolute right-3 bottom-3 rounded-full p-2"
        type="submit"
        size="icon"
        disabled={message.length === 0 || disabled}
      >
        <SearchIcon className="size-4" />
      </Button>
    </form>
  );
}

export default ChatInput;
