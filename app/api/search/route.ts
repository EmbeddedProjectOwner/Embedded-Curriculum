import { InferPageType, Page } from '@/Modules/fumadocs-core/dist/source';
import { source } from '../../source';
import { createFromSource } from 'fumadocs-core/search/server';
 
export const { GET } = createFromSource(source, (page: Page) => (
    console.log(page.data.structuredData), {
  title: page.data.title,
  description: page.data.description,
  url: page.url,
  id: page.url,
  structuredData: page.data.structuredData,
  tag: 'Course1',
}));
