import "./chunk-MLKGABMK.js";

// src/breadcrumb.tsx
import { useMemo } from "react";
function useBreadcrumb(url, tree, options) {
  return useMemo(
    () => getBreadcrumbItems(url, tree, options),
    [tree, url, options]
  );
}
function getBreadcrumbItems(url, tree, options = {}) {
  return getBreadcrumbItemsFromPath(
    tree,
    searchPath(tree.children, url) ?? [],
    options
  );
}
function getBreadcrumbItemsFromPath(tree, path, options) {
  const { includePage = true, includeSeparator = false, includeRoot } = options;
  let items = [];
  path.forEach((item, i) => {
    if (item.type === "separator" && includeSeparator) {
      items.push({
        name: item.name
      });
    }
    if (item.type === "folder") {
      const next = path.at(i + 1);
      if (next && item.index === next) return;
      if (item.root) {
        items = [];
        return;
      }
      items.push({
        name: item.name,
        url: item.index?.url
      });
    }
    if (item.type === "page" && includePage) {
      items.push({
        name: item.name,
        url: item.url
      });
    }
  });
  if (includeRoot) {
    items.unshift({
      name: tree.name,
      url: typeof includeRoot === "object" ? includeRoot.url : void 0
    });
  }
  return items;
}
function searchPath(nodes, url) {
  let separator;
  for (const node of nodes) {
    if (node.type === "separator") separator = node;
    if (node.type === "folder") {
      if (node.index?.url === url) {
        const items2 = [];
        if (separator) items2.push(separator);
        items2.push(node, node.index);
        return items2;
      }
      const items = searchPath(node.children, url);
      if (items) {
        items.unshift(node);
        if (separator) items.unshift(separator);
        return items;
      }
    }
    if (node.type === "page" && node.url === url) {
      const items = [];
      if (separator) items.push(separator);
      items.push(node);
      return items;
    }
  }
  return null;
}
export {
  getBreadcrumbItems,
  getBreadcrumbItemsFromPath,
  searchPath,
  useBreadcrumb
};
