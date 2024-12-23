'use client';
import { createContext, useContext } from 'react';
export const I18nContext = createContext({
    text: {
        search: 'Search',
        searchNoResult: 'No results found',
        toc: 'On this page',
        tocNoHeadings: 'No Headings',
        lastUpdate: 'Last updated on',
        chooseLanguage: 'Choose a language',
        nextPage: 'Next',
        previousPage: 'Previous',
        chooseTheme: 'Theme',
        editOnGithub: 'Edit on GitHub',
    },
});
export function I18nLabel(props) {
    const { text } = useI18n();
    return text[props.label];
}
export function useI18n() {
    return useContext(I18nContext);
}
