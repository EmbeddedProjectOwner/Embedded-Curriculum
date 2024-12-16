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
          enabled: true,
          preload: true,
          options: {
            type: "fetch",
            defaultTag: "Course1",
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
        }}>{children}</RootProvider>
      </body>
    </html>
  );
}
