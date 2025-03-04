import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import CustomDialog from './search';
import { ScrollWrapper } from './scrollWrapper';
import 'fumadocs-twoslash/twoslash.css';
import { Metadata } from 'next';
const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: {
    icon: "/EmbeddedLogoScaled.png", apple: "/EmbeddedLogoScaled.png"
  }
}

/*async function customSearchDialog() {
  'use cache'

  return CustomDialog
}*/
export default /*async*/ function Layout({ children }: { children: ReactNode }) {
  // 'use cache'
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            SearchDialog: CustomDialog, //await customSearchDialog(),
            enabled: true,
            options: {
              type: "static",
              defaultTag: "Course1",
              tags: [
                {
                  name: 'Course 1',
                  value: 'Course1',
                  subTags: [
                    {
                      name: 'Unit 1',
                      value: 'U1',
                    },
                    {
                      name: 'Unit 2',
                      value: 'U2',
                    }
                  ]
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
