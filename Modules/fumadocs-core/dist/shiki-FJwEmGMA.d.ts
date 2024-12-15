import { ShikiTransformer, CodeToHastOptionsCommon, BundledLanguage, HighlighterCoreOptions, CodeOptionsThemes, CodeOptionsMeta } from 'shiki';
import { BundledTheme } from 'shiki/themes';
import { Components } from 'hast-util-to-jsx-runtime';
import { ReactNode } from 'react';

declare function createStyleTransformer(): ShikiTransformer;
declare const defaultThemes: {
    light: string;
    dark: string;
};
type HighlightOptions = CodeToHastOptionsCommon<BundledLanguage> & Pick<HighlighterCoreOptions, 'engine'> & Partial<CodeOptionsThemes<BundledTheme>> & CodeOptionsMeta & {
    components?: Partial<Components>;
};
declare function highlight(code: string, options: HighlightOptions): Promise<ReactNode>;

export { type HighlightOptions as H, createStyleTransformer as c, defaultThemes as d, highlight as h };
