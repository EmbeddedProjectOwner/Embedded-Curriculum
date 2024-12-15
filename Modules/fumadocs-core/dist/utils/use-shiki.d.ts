import { ReactNode, DependencyList } from 'react';
import { H as HighlightOptions } from '../shiki-FJwEmGMA.js';
import 'shiki';
import 'shiki/themes';
import 'hast-util-to-jsx-runtime';

declare function useShiki(code: string, options: HighlightOptions & {
    defaultValue?: ReactNode;
}, deps?: DependencyList): ReactNode;

export { useShiki };
