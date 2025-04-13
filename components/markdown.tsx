import Link from 'next/link';
import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  children: string;
};

const NonMemoizedMarkdown = ({ children }: Props) => {
  const components: Partial<Components> = {
    ol: ({ children, ...props }) => {
      return (
        <ol className="ml-4 list-outside list-decimal" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ children, ...props }) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ children, ...props }) => {
      return (
        <ul className="list-inside list-disc" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ children, ...props }) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    em: ({ children, ...props }) => {
      return (
        <span className="italic" {...props}>
          {children}
        </span>
      );
    },
    p: ({ children, ...props }) => {
      return (
        <p className="mb-2" {...props}>
          {children}
        </p>
      );
    },
    a: ({ children, href, ...props }) => {
      if (!href) {
        return (
          <span className="font-medium underline" {...props}>
            {children}
          </span>
        );
      }

      return (
        <Link
          className="font-medium underline"
          target="_blank"
          rel="noreferrer"
          href={href}
          {...props}
        >
          {children}
        </Link>
      );
    },
    h1: ({ children, ...props }) => {
      return (
        <h1 className="mb-2 mt-6 text-xl font-semibold" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      return (
        <h2 className="mb-2 mt-6 text-xl font-semibold" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      return (
        <h3 className="mb-2 mt-6 text-xl font-semibold" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      return (
        <h4 className="mb-2 mt-6 text-lg font-semibold" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }) => {
      return (
        <h5 className="mb-2 mt-6 text-base font-semibold" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }) => {
      return (
        <h6 className="mb-2 mt-6 text-sm font-semibold" {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
