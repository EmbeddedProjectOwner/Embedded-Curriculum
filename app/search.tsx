"use client";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialogProps,
  SearchDialog,
  SharedProps
} from "fumadocs-ui/components/dialog/search";
import { ReactNode, useEffect, useState } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { createContext, useContext } from 'react';
import { TagsList as otherTagList, type TagItem } from "@/Modules/fumadocs-ui/dist/components/dialog/tag-list";
import React from "react";
import { SortedResult } from "@/Modules/fumadocs-core/dist/server";
import { TagsList } from "@/components/custom/CustomTagList/customTagList";

export interface Translations {
  search: string;
  searchNoResult: string;
  toc: string;
  tocNoHeadings: string;
  lastUpdate: string;
  chooseLanguage: string;
  nextPage: string;
  previousPage: string;
  chooseTheme: string;
  editOnGithub: string;
}
export interface LocaleItem {
  name: string;
  locale: string;
}
interface I18nContextType {
  locale?: string;
  onChange?: (v: string) => void;
  text: Translations;
  locales?: LocaleItem[];
}


export interface DefaultSearchDialogProps extends SharedProps {
  /**
   * @defaultValue 'fetch'
   */
  type?: 'fetch' | 'static';
  defaultTag?: string;
  tags?: TagItem[];
  /**
   * Search API URL
   */
  api?: string;
  /**
   * The debounced delay for performing a search.
   */
  delayMs?: number;
  footer?: ReactNode;
  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;

}


export const I18nContext: import('react').Context<I18nContextType> = createContext({
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

export function I18nLabel(props: keyof Translations): string {
  const { text } = useI18n();

  return text as unknown as string;
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext);
}



interface queryResultEntry {
  content: string,
  id: string,
  type: string,
  url: string,
}

interface queryResult extends Array<queryResultEntry> { }

function CustomSearchDialog({ defaultTag, tags, api, delayMs, type, allowClear, ...props }: DefaultSearchDialogProps): ReactNode {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);
  const [realResults, setRealResults] = useState<queryResult | 'empty'>([])
  const { search, setSearch, query } = useDocsSearch(type === 'fetch'
    ? {
      type: 'fetch',
      api,
    }
    : {
      type: 'static',
      from: api
    }, locale, /*tag*/ undefined, delayMs, allowClear);
  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  useEffect(() => {
    if (query.data && query.data !== "empty") {
      setRealResults([])
      const filteredResults = (query.data as queryResult).filter((entry) => {
        let isSubTag = false

        if (tag?.includes("__|__")) {
          isSubTag = true
        } 
        const withoutParams = entry.url.split(/[?#]/, 1)[0]

        const entryURL = withoutParams.split('/');

        let returnVal

        if (isSubTag && tag) {
          var tagSplit = tag.split("__|__")
          const firstTag = entryURL.includes(tagSplit[0])
          const secondTag = entryURL.includes(tagSplit[1])

          returnVal = (firstTag && secondTag) || false
        } else {
          returnVal = !tag || entryURL.includes(tag);
        }
        return returnVal
      });

      setRealResults(filteredResults);
    } else {
      setRealResults("empty");
    }

  }, [query.data, tag]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      results={realResults as unknown as SortedResult[] ?? []}
      footer={
        tags ? (
          <>
            <TagsList
              tag={tag}
              onTagChange={setTag}
              items={tags}
              allowClear={allowClear}
            />
            {props.footer}
          </>
        ) : (
          props.footer
        )
      }
      {...props} />
  )
}

const StaticSearch = (props: SearchDialogProps) => {
  return (
    <CustomSearchDialog {...props} ></CustomSearchDialog>
  )
};

export default StaticSearch;

