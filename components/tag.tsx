import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};

function Tag({ children, className }: Props) {
  return (
    <span
      className={cn(
        'text-xs text-muted-foreground bg-muted/50 border border-muted rounded-sm px-1.5 py-1',
        className
      )}
    >
      {children}
    </span>
  );
}

export default Tag;
