import {
  removeUndefined
} from "./chunk-2V6SCS43.js";
import "./chunk-MLKGABMK.js";

// src/search/client/orama-cloud.ts
async function searchDocs(query, tag, options) {
  const { client, params: extraParams = {} } = options;
  const params = {
    ...extraParams,
    term: query,
    where: removeUndefined({
      tag,
      ...extraParams.where
    }),
    groupBy: {
      properties: ["page_id"],
      maxResult: 7,
      ...extraParams.groupBy
    }
  };
  const result = await client.search(params);
  if (!result) return [];
  const list = [];
  for (const item of result.groups ?? []) {
    let addedHead = false;
    for (const hit of item.result) {
      const doc = hit.document;
      if (!addedHead) {
        list.push({
          id: doc.page_id,
          type: "page",
          content: doc.title,
          url: doc.url
        });
        addedHead = true;
      }
      list.push({
        id: doc.id,
        content: doc.content,
        type: doc.content === doc.section ? "heading" : "text",
        url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url
      });
    }
  }
  return list;
}
export {
  searchDocs
};
