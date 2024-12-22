import "./chunk-MLKGABMK.js";

// src/search/client/fetch.ts
async function fetchDocs(query, locale, tag, options) {
  const params = new URLSearchParams();
  params.set("query", query);
  if (locale) params.set("locale", locale);
  if (tag) params.set("tag", tag);
  
  const res = await fetch(
    `${options.api ?? "/api/search"}?${params.toString()}`
  );
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
export {
  fetchDocs
};
