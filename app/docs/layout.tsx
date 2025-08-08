import { Suspense, type ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '../source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { Slot } from '@radix-ui/react-slot';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: "/EmbeddedLogoScaled.png", // Correct path
    apple: "/EmbeddedLogoScaled.png",
  },
};



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <DocsLayout tree={source.pageTree} sidebar={{
        prefetch: false,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);

            if (!meta) return option;
            return {
              ...option,
              icon: (
                <Slot
                  className="bg-gradient-to-t from-fd-background/80 p-1 [&_svg]:size-5"
                  style={{
                    color: `hsl(var(--${meta.file.dirname}-color))`,
                    backgroundColor: `hsl(var(--${meta.file.dirname}-color)/.3)`,
                  }}
                >
                  {node.icon}
                </Slot>
              ),
            };
          },
        },
      }} {...baseOptions}>
        {children}
      </DocsLayout>
    </Suspense>
  );
}
