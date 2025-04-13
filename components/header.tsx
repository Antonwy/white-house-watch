import Link from 'next/link';
import NotifyMeDialog from './notify-me-dialog';
import { Button } from './ui/button';
import WhitehouseWatchLogo from './whitehouse-watch-logo';
import { ArrowLeft } from 'lucide-react';

type Props = {
  showBackButton?: boolean;
};

function Header({ showBackButton = false }: Props) {
  return (
    <header className="flex flex-col items-center justify-center my-4">
      <WhitehouseWatchLogo />

      <p className="text-sm text-muted-foreground text-center px-2">
        Stay ahead with the latest from the White House.
      </p>

      <div className="flex flex-row gap-2 mt-4">
        {showBackButton && (
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}

        <NotifyMeDialog />
      </div>
    </header>
  );
}

export default Header;
