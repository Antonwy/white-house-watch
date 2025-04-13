import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

function Tag({ children, className, onClick }: Props) {
  const Slot = onClick ? 'button' : 'span';

  return (
    <Slot
      className={cn(
        'text-xs text-muted-foreground bg-muted/50 border border-muted rounded-sm px-1.5 py-1 transition-colors',
        className,
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Slot>
  );
}

export default Tag;
