import {
  __async,
  __spreadProps,
  __spreadValues,
  generateDocumentation,
  getProject,
  renderMarkdownToHast
} from "../chunk-2L4CMRDQ.js";

// src/ui/auto-type-table.tsx
import fs from "node:fs/promises";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import * as runtime from "react/jsx-runtime";
import defaultMdxComponents from "fumadocs-ui/mdx";
import "server-only";
import { Fragment as Fragment2, jsx as jsx2 } from "react/jsx-runtime";
function createTypeTable(options = {}) {
  var _a;
  const project = (_a = options.project) != null ? _a : getProject(options.config);
  return {
    AutoTypeTable(props) {
      return /* @__PURE__ */ jsx2(AutoTypeTable, __spreadProps(__spreadValues({}, props), { options: __spreadProps(__spreadValues({}, options), { project }) }));
    }
  };
}
function AutoTypeTable(_0) {
  return __async(this, arguments, function* ({
    path,
    name,
    type,
    options = {}
  }) {
    let typeName = name;
    let content = "";
    if (path) {
      content = yield fs.readFile(path).then((res) => res.toString());
    }
    if (type && type.split("\n").length > 1) {
      content += `
${type}`;
    } else if (type) {
      typeName != null ? typeName : typeName = "$Fumadocs";
      content += `
export type ${typeName} = ${type}`;
    }
    const output = generateDocumentation(
      path != null ? path : "temp.ts",
      typeName,
      content,
      options
    );
    if (name && output.length === 0)
      throw new Error(`${name} in ${path != null ? path : "empty file"} doesn't exist`);
    return /* @__PURE__ */ jsx2(Fragment2, { children: output.map((item) => __async(this, null, function* () {
      const entries = item.entries.map(
        (entry) => __async(this, null, function* () {
          return [
            entry.name,
            {
              type: entry.type,
              description: yield renderMarkdown(entry.description),
              default: entry.tags.default || entry.tags.defaultValue
            }
          ];
        })
      );
      return /* @__PURE__ */ jsx2(
        TypeTable,
        {
          type: Object.fromEntries(yield Promise.all(entries))
        },
        item.name
      );
    })) });
  });
}
function renderMarkdown(md) {
  return __async(this, null, function* () {
    return toJsxRuntime(yield renderMarkdownToHast(md), {
      Fragment: runtime.Fragment,
      jsx: runtime.jsx,
      jsxs: runtime.jsxs,
      // @ts-expect-error -- mdx components
      components: __spreadProps(__spreadValues({}, defaultMdxComponents), { img: void 0 })
    });
  });
}
export {
  AutoTypeTable,
  createTypeTable
};
