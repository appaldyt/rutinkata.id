'use client';

import Navigation from './Navigation';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="md:ml-64 pt-6 pb-20 md:py-6">
        <div className="container mx-auto max-w-2xl px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
