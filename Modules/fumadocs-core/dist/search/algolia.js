import "../chunk-MLKGABMK.js";

// src/search/algolia.ts
async function sync(client, options) {
  const { document = "document", documents } = options;
  const index = client.initIndex(document);
  await setIndexSettings(index);
  await updateDocuments(index, documents);
}
async function setIndexSettings(index) {
  await index.setSettings({
    attributeForDistinct: "page_id",
    attributesToRetrieve: ["title", "section", "content", "url", "section_id"],
    searchableAttributes: ["title", "section", "content"],
    attributesToSnippet: [],
    attributesForFaceting: ["tag"]
  });
}
function toIndex(page) {
  let id = 0;
  const indexes = [];
  const scannedHeadings = /* @__PURE__ */ new Set();
  function createIndex(section, sectionId, content) {
    return {
      objectID: `${page._id}-${(id++).toString()}`,
      title: page.title,
      url: page.url,
      page_id: page._id,
      tag: page.tag,
      section,
      section_id: sectionId,
      content,
      ...page.extra_data
    };
  }
  if (page.description)
    indexes.push(createIndex(void 0, void 0, page.description));
  page.structured.contents.forEach((p) => {
    const heading = p.heading ? page.structured.headings.find((h) => p.heading === h.id) : null;
    const index = createIndex(heading?.content, heading?.id, p.content);
    if (heading && !scannedHeadings.has(heading.id)) {
      scannedHeadings.add(heading.id);
      indexes.push(createIndex(heading.content, heading.id, heading.content));
    }
    indexes.push(index);
  });
  return indexes;
}
async function updateDocuments(index, documents) {
  const objects = documents.flatMap(toIndex);
  await index.replaceAllObjects(objects);
}
export {
  setIndexSettings,
  sync,
  updateDocuments
};
