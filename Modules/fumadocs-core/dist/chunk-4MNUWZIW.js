// src/mdx-plugins/remark-heading.ts
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";

// src/mdx-plugins/remark-utils.ts
function flattenNode(node) {
  if ("children" in node)
    return node.children.map((child) => flattenNode(child)).join("");
  if ("value" in node) return node.value;
  return "";
}

// src/mdx-plugins/remark-heading.ts
var slugger = new Slugger();
var regex = /\s*\[#(?<slug>[^]+?)]\s*$/;
function remarkHeading({
  slug: defaultSlug,
  customId = true,
  generateToc = true
} = {}) {
  return (root, file) => {
    const toc = [];
    slugger.reset();
    if (file.data.frontmatter) {
      const frontmatter = file.data.frontmatter;
      if (frontmatter._openapi?.toc) {
        toc.push(...frontmatter._openapi.toc);
      }
    }
    visit(root, "heading", (heading) => {
      heading.data ||= {};
      heading.data.hProperties ||= {};
      const lastNode = heading.children.at(-1);
      if (!heading.data.hProperties.id && lastNode?.type === "text" && customId) {
        const match = regex.exec(lastNode.value);
        if (match?.[1]) {
          heading.data.hProperties.id = match[1];
          lastNode.value = lastNode.value.slice(0, match.index);
        }
      }
      const value = flattenNode(heading);
      let id = heading.data.hProperties.id;
      if (!id) {
        id = defaultSlug ? defaultSlug(root, heading, value) : slugger.slug(value);
      }
      heading.data.hProperties.id = id;
      if (generateToc)
        toc.push({
          title: value,
          url: `#${id}`,
          depth: heading.depth
        });
      return "skip";
    });
    if (generateToc) file.data.toc = toc;
  };
}

export {
  flattenNode,
  remarkHeading
};
