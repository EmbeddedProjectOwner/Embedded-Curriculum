import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
        search={{
          options: {
            defaultTag: 'Course 1',
            tags: [
              {
                name: 'Course 1',
                value: 'Course1',
              },
              {
                name: 'Course 2',
                value: 'ui',
              },
            ],
          },
          links: [
            ['Course 1', '/docs/Course1'],
            ['Course 2', '/docs/Course2']
          ]
        }}>{children}</RootProvider>
      </body>
    </html>
  );
}
