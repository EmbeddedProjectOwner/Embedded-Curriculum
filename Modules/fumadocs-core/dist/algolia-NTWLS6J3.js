import "./chunk-MLKGABMK.js";

// src/search/client/algolia.ts
function groupResults(hits) {
  const grouped = [];
  const scannedUrls = /* @__PURE__ */ new Set();
  for (const hit of hits) {
    if (!scannedUrls.has(hit.url)) {
      scannedUrls.add(hit.url);
      grouped.push({
        id: hit.url,
        type: "page",
        url: hit.url,
        content: hit.title
      });
    }
    grouped.push({
      id: hit.objectID,
      type: hit.content === hit.section ? "heading" : "text",
      url: hit.section_id ? `${hit.url}#${hit.section_id}` : hit.url,
      content: hit.content
    });
  }
  return grouped;
}
async function searchDocs(index, query, tag, options) {
  let filters = options?.filters;
  if (tag) filters = filters ? `tag:${tag} AND (${filters})` : `tag:${tag}`;
  if (query.length === 0) {
    const result2 = await index.search(query, {
      distinct: 1,
      hitsPerPage: 8,
      ...options,
      filters
    });
    return groupResults(result2.hits).filter((hit) => hit.type === "page");
  }
  const result = await index.search(query, {
    distinct: 5,
    hitsPerPage: 10,
    ...options,
    filters
  });
  return groupResults(result.hits);
}
export {
  groupResults,
  searchDocs
};
