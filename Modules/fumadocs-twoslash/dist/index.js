import {
  __spreadProps,
  __spreadValues
} from "./chunk-ORMEWXMH.js";

// src/index.ts
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { defaultHandlers, toHast } from "mdast-util-to-hast";
import {
  transformerTwoslash as originalTransformer
} from "@shikijs/twoslash";
function transformerTwoslash(options) {
  var _a, _b;
  const ignoreClass = "nd-copy-ignore";
  return originalTransformer(__spreadProps(__spreadValues({
    explicitTrigger: true
  }, options), {
    twoslashOptions: __spreadProps(__spreadValues({}, options == null ? void 0 : options.twoslashOptions), {
      compilerOptions: __spreadValues({
        moduleResolution: 100
      }, (_a = options == null ? void 0 : options.twoslashOptions) == null ? void 0 : _a.compilerOptions)
    }),
    rendererRich: __spreadValues({
      classExtra: ignoreClass,
      renderMarkdown,
      renderMarkdownInline,
      hast: __spreadValues({
        hoverToken: {
          tagName: "Popup"
        },
        hoverPopup: {
          tagName: "PopupContent"
        },
        hoverCompose: ({ popup, token }) => [
          popup,
          {
            type: "element",
            tagName: "PopupTrigger",
            properties: {
              asChild: true
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  class: "twoslash-hover"
                },
                children: [token]
              }
            ]
          }
        ],
        popupDocs: {
          class: "prose twoslash-popup-docs"
        },
        popupTypes: {
          tagName: "div",
          class: "shiki prose-no-margin",
          children: (v) => {
            if (v.length === 1 && v[0].type === "element" && v[0].tagName === "pre")
              return v;
            return [
              {
                type: "element",
                tagName: "code",
                properties: {
                  class: "twoslash-popup-code"
                },
                children: v
              }
            ];
          }
        },
        popupDocsTags: {
          class: "prose twoslash-popup-docs twoslash-popup-docs-tags"
        },
        nodesHighlight: {
          class: "highlighted-word twoslash-highlighted"
        }
      }, (_b = options == null ? void 0 : options.rendererRich) == null ? void 0 : _b.hast)
    }, options == null ? void 0 : options.rendererRich)
  }));
}
function renderMarkdown(md) {
  const mdast = fromMarkdown(
    md.replace(new RegExp("{@link (?<link>[^}]*)}", "g"), "$1"),
    // replace jsdoc links
    { mdastExtensions: [gfmFromMarkdown()] }
  );
  return toHast(mdast, {
    handlers: {
      code: (state, node) => {
        var _a;
        if (node.lang) {
          return this.codeToHast(node.value, __spreadProps(__spreadValues({}, this.options), {
            transformers: [],
            meta: {
              __raw: (_a = node.meta) != null ? _a : void 0
            },
            lang: node.lang
          })).children[0];
        }
        return defaultHandlers.code(state, node);
      }
    }
  }).children;
}
function renderMarkdownInline(md, context) {
  const text = context === "tag:param" ? md.replace(new RegExp("^(?<link>[\\w$-]+)"), "`$1` ") : md;
  const children = renderMarkdown.call(this, text);
  if (children.length === 1 && children[0].type === "element" && children[0].tagName === "p")
    return children[0].children;
  return children;
}
export {
  transformerTwoslash
};
