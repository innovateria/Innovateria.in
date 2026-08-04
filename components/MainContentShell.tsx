'use client';

import { usePathname } from 'next/navigation';

export default function MainContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="w-full flex-grow flex flex-col h-screen max-h-screen overflow-hidden bg-[#0B0F17]">
        {children}
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-full overflow-x-hidden pt-20 sm:pt-24 min-h-[100dvh] pb-12 sm:pb-20">
      {children}
    </main>
  );
}
