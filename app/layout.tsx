
import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import CustomDialog from './search';
import { ScrollWrapper } from './scrollWrapper';

const inter = Inter({
  subsets: ['latin'],
});

async function customSearchDialog() {
  'use cache'

  return CustomDialog
}
export default async function Layout({ children }: { children: ReactNode }) {
  'use cache'
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
        search={{
          SearchDialog: await customSearchDialog(),
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
        }}><ScrollWrapper>{children}</ScrollWrapper></RootProvider>
      </body>
    </html>
  );
}
