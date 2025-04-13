import ChatView from '@/components/chat-view';
import Header from '@/components/header';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function ChatPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = params.query || 'Chat';

  if (!query || typeof query !== 'string') {
    return <div>No query</div>;
  }

  return (
    <main className="relative flex flex-col min-h-[100dvh] max-h-[100dvh]">
      <Header showBackButton />

      <ChatView query={query} />
    </main>
  );
}

export default ChatPage;
