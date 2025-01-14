// src/server/shiki.ts
import {
  getSingletonHighlighter
} from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import github_dark_colorblind from '../../../themes/github-dark-colorblind.json' with { type: "json"}
import github_light_colorblind from '../../../themes/github-light-colorblind.json' with { type: "json"}

function createStyleTransformer() {
  return {
    name: "rehype-code:styles",
    line(hast) {
      if (hast.children.length === 0) {
        hast.children.push({
          type: "text",
          value: " "
        });
      }
    }
  };
}
var defaultThemes = {
  light: github_light_colorblind,//"github-light-high-contrast",
  dark: github_dark_colorblind//"github-dark-high-contrast"
};
async function highlight(code, options) {
  const { lang, components, engine, ...rest } = options;
  let themes = { themes: defaultThemes };
  if ("theme" in options && options.theme) {
    themes = { theme: options.theme };
  } else if ("themes" in options && options.themes) {
    themes = { themes: options.themes };
  }
  
  const highlighter = await getSingletonHighlighter({
    langs: [lang],
    engine: engine ?? createOnigurumaEngine(() => import("shiki/wasm")),
    themes: defaultThemes
    //themes: "theme" in themes ? [themes.theme] : Object.values(themes.themes).filter((v) => v !== void 0)
  });
  const hast = highlighter.codeToHast(code, {
    lang,
    ...rest,
    ...themes,
    transformers: [createStyleTransformer(), ...rest.transformers ?? []],
    defaultColor: "themes" in themes ? false : void 0
  });
  return toJsxRuntime(hast, {
    jsx,
    jsxs,
    development: false,
    components,
    Fragment
  });
}

export {
  createStyleTransformer,
  defaultThemes,
  highlight
};
