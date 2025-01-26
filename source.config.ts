import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { transformerTwoslash } from 'fumadocs-twoslash';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { z } from 'zod';
import { remarkMermaid } from '@theguild/remark-mermaid';
import { LandPlot } from 'lucide-react';


export const { docs, meta } = defineDocs({
  docs: {
    async: false,
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypeCodeOptions: {
      inline: 'tailing-curly-colon',
      /*themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },*/
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
        {
          name: 'transformers:remove-notation-escape',
          code(hast) {
            for (const line of hast.children) {
              if (line.type !== 'element') continue;

              const lastSpan = line.children.findLast(
                (v) => v.type === 'element',
              );

              const head = lastSpan?.children[0];
              if (head?.type !== 'text') return;

              head.value = head.value.replace(/\[\\!code/g, '[!code');
            }
          },
        },
      ],
    },
    remarkPlugins: [remarkMermaid, remarkMath],
    rehypePlugins: (v) => [
      rehypeKatex,
      ...v,
    ],
  },
});


