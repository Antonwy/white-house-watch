import Link from 'next/link';
import Image from 'next/image';
function WhitehouseWatchLogo() {
  return (
    <Link href="/" className="flex flex-col items-center gap-4">
      <Image
        src="/whitehouse-logo.webp"
        alt="Whitehouse Logo"
        width={120}
        height={120}
      />

      <h1 className="text-4xl font-[500] text-whitehouse font-[family-name:var(--font-scheherazade-new)] text-center">
        WHITEHOUSE WATCH
      </h1>
    </Link>
  );
}

export default WhitehouseWatchLogo;
