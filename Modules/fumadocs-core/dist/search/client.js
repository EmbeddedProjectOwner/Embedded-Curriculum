"use client";
import {
  useOnChange
} from "../chunk-EMWGTXSW.js";
import "../chunk-MLKGABMK.js";

// src/search/client.ts
import { useMemo, useRef as useRef2, useState as useState2 } from "react";

// src/utils/use-debounce.ts
import { useRef, useState } from "react";
function useDebounce(value, delayMs = 1e3) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timer = useRef();
  if (delayMs === 0) return value;
  if (value !== debouncedValue && timer.current?.value !== value) {
    if (timer.current) clearTimeout(timer.current.handler);
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    timer.current = { value, handler };
  }
  return debouncedValue;
}

// src/search/client.ts
var cache = /* @__PURE__ */ new Map();
var staticClient;
function useDocsSearch(client, locale, tag, delayMs = 100, allowEmpty = false, key) {
  const [search, setSearch] = useState2("");
  const [results, setResults] = useState2("empty");
  const [error, setError] = useState2();
  const [isLoading, setIsLoading] = useState2(false);
  const debouncedValue = useDebounce(search, delayMs);
  const onStart = useRef2();
  const cacheKey = useMemo(() => {
    return key ?? JSON.stringify([client.type, debouncedValue, locale, tag]);
  }, [client.type, debouncedValue, locale, tag, key]);

  async function run() {
    if (debouncedValue.length === 0 && !allowEmpty) return "empty";
    if (client.type === "fetch") {
      const { fetchDocs } = await import("../fetch-4K7QOPFM.js");
      return fetchDocs(debouncedValue, locale, tag, client);
    }
    if (client.type === "algolia") {
      const { index, type: _, ...rest } = client;
      const { searchDocs } = await import("../algolia-NTWLS6J3.js");
      return searchDocs(index, debouncedValue, tag, rest);
    }
    if (client.type === "orama-cloud") {
      const { searchDocs } = await import("../orama-cloud-QNHGN6SO.js");
      return searchDocs(debouncedValue, tag, client);
    }
    const { createStaticClient } = await import("../static-5GPJ7RUY.js");
    if (!staticClient) staticClient = createStaticClient(client);
    const res = staticClient.search(debouncedValue, locale, tag);

    return res
  }

  useOnChange(cacheKey, () => {
    const cached = cache.get(cacheKey);
    if (onStart.current) {
      onStart.current();
      onStart.current = void 0;
    }
    if (cached) {
      setIsLoading(false);
      setError(void 0);
      setResults(cached);
      return;
    }
    setIsLoading(true);
    let interrupt = false;
    onStart.current = () => {
      interrupt = true;
    };
   
    void run().then((res) => {
      cache.set(cacheKey, res);
      if (interrupt) return;
      setError(void 0);
      setResults(res);
    }).catch((err) => {
      setError(err);
    }).finally(() => {
      setIsLoading(false);
    });
  });
  
 
  return { search, setSearch, query: { isLoading, data: results, error }};
}
export {
  useDocsSearch
};
