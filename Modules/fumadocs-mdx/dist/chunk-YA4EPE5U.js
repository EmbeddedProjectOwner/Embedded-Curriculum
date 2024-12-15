// src/utils/schema.ts
import { z } from "zod";
var metaSchema = z.object({
  title: z.string().optional(),
  pages: z.array(z.string()).optional(),
  description: z.string().optional(),
  root: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  icon: z.string().optional()
});
var frontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
  // Fumadocs OpenAPI generated
  _openapi: z.object({}).passthrough().optional()
});

// src/config/define.ts
function defineCollections(options) {
  return {
    _doc: "collections",
    // @ts-expect-error -- internal type inferring
    _type: void 0,
    ...options
  };
}
function defineDocs(options) {
  const dir = options?.dir ?? "content/docs";
  return {
    docs: defineCollections({
      type: "doc",
      dir,
      schema: frontmatterSchema,
      ...options?.docs
    }),
    meta: defineCollections({
      type: "meta",
      dir,
      schema: metaSchema,
      ...options?.meta
    })
  };
}
function defineConfig(config = {}) {
  return config;
}

// src/utils/mdx-options.ts
import {
  rehypeCode,
  rehypeToc,
  remarkGfm,
  remarkHeading,
  remarkImage,
  remarkStructure
} from "fumadocs-core/mdx-plugins";

// src/mdx-plugins/remark-exports.ts
import { valueToEstree } from "estree-util-value-to-estree";
function remarkMdxExport({ values }) {
  return (tree, vfile) => {
    for (const name of values) {
      if (!(name in vfile.data)) return;
      tree.children.unshift(getMdastExport(name, vfile.data[name]));
    }
  };
}
function getMdastExport(name, value) {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            specifiers: [],
            source: null,
            declaration: {
              type: "VariableDeclaration",
              kind: "let",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: {
                    type: "Identifier",
                    name
                  },
                  init: valueToEstree(value)
                }
              ]
            }
          }
        ]
      }
    }
  };
}

// src/utils/mdx-options.ts
function pluginOption(def, options = []) {
  const list = def(Array.isArray(options) ? options : []).filter(
    Boolean
  );
  if (typeof options === "function") {
    return options(list);
  }
  return list;
}
function getDefaultMDXOptions({
  valueToExport = [],
  rehypeCodeOptions,
  remarkImageOptions,
  remarkHeadingOptions,
  remarkStructureOptions,
  ...mdxOptions
}) {
  const mdxExports = [
    "structuredData",
    "frontmatter",
    "lastModified",
    ...valueToExport
  ];
  const remarkPlugins = pluginOption(
    (v) => [
      remarkGfm,
      [
        remarkHeading,
        {
          generateToc: false,
          ...remarkHeadingOptions
        }
      ],
      remarkImageOptions !== false && [remarkImage, remarkImageOptions],
      ...v,
      remarkStructureOptions !== false && [
        remarkStructure,
        remarkStructureOptions
      ],
      [remarkMdxExport, { values: mdxExports }]
    ],
    mdxOptions.remarkPlugins
  );
  const rehypePlugins = pluginOption(
    (v) => [
      rehypeCodeOptions !== false && [rehypeCode, rehypeCodeOptions],
      ...v,
      [rehypeToc]
    ],
    mdxOptions.rehypePlugins
  );
  return {
    ...mdxOptions,
    remarkPlugins,
    rehypePlugins
  };
}

export {
  metaSchema,
  frontmatterSchema,
  defineCollections,
  defineDocs,
  defineConfig,
  getDefaultMDXOptions
};
