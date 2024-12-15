import {
  removeUndefined
} from "./chunk-2V6SCS43.js";

// src/search/search/simple.ts
import { search } from "@orama/orama";
async function searchSimple(db, query, params = {}) {
  const result = await search(db, {
    term: query,
    tolerance: 1,
    ...params,
    boost: {
      title: 2,
      ..."boost" in params ? params.boost : void 0
    }
  });
  return result.hits.map((hit) => ({
    type: "page",
    content: hit.document.title,
    id: hit.document.url,
    url: hit.document.url
  }));
}

// src/search/search/advanced.ts
import { getByID, search as search2 } from "@orama/orama";
async function searchAdvanced(db, query, tag, extraParams = {}) {
  let params = {
    where: removeUndefined({
      tag,
      ...extraParams.where
    }),
    groupBy: {
      properties: ["page_id"],
      maxResult: 8,
      ...extraParams.groupBy
    }
  };
  if (query.length > 0) {
    params = {
      ...params,
      term: query,
      tolerance: 1,
      properties: ["content", "keywords"],
      ...extraParams,
      where: params.where,
      groupBy: params.groupBy
    };
  }
  const result = await search2(db, params);
  const list = [];
  for (const item of result.groups ?? []) {
    const pageId = item.values[0];
    const page = getByID(db, pageId);
    if (!page) continue;
    list.push({
      id: pageId,
      type: "page",
      content: page.content,
      url: page.url
    });
    for (const hit of item.result) {
      if (hit.document.type === "page") continue;
      list.push({
        id: hit.document.id.toString(),
        content: hit.document.content,
        type: hit.document.type,
        url: hit.document.url
      });
    }
  }
  return list;
}

export {
  searchSimple,
  searchAdvanced
};
