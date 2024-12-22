import {
  searchAdvanced,
  searchSimple
} from "./chunk-2ZSMGYVH.js";
import "./chunk-2V6SCS43.js";
import "./chunk-MLKGABMK.js";

// src/search/client/static.ts
import {
  create,
  load
} from "@orama/orama";
function createStaticClient({
  from = "/api/search"
}) {
  const dbs = /* @__PURE__ */ new Map();
  async function init() {
    
    const res = await fetch(from);
    if (!res.ok)
      throw new Error(
        `failed to fetch exported search indexes from ${from}, make sure the search database is exported and available for client.`
      );
    const data = await res.json();
    if (data.type === "i18n") {
      Object.entries(data.data).forEach(([k, v]) => {
        const db = create({ schema: { _: "string" } });
        load(db, v);
        dbs.set(k, {
          type: v.type,
          db
        });
      });
    } else {
      const db = create({ schema: { _: "string" } });
      load(db, data);
      dbs.set("", {
        type: data.type,
        db
      });
    }
  }
  const get = init();
  return {
    async search(query, locale, tag) {
      await get;
      const cached = dbs.get(locale ?? "");
      if (!cached) return [];
      if (cached.type === "simple")
        return searchSimple(cached, query);
      return searchAdvanced(
        cached.db,
        query,
        tag
      );
    }
  };
}
export {
  createStaticClient
};
