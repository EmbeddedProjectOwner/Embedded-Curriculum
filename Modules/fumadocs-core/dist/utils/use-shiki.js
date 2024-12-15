"use client";
import {
  highlight
} from "../chunk-7CSWJQ5H.js";
import "../chunk-MLKGABMK.js";

// src/utils/use-shiki.tsx
import {
  useEffect,
  useState
} from "react";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { jsx } from "react/jsx-runtime";
var jsEngine;
function useShiki(code, options, deps) {
  const [out, setOut] = useState(() => {
    if (options.defaultValue) return options.defaultValue;
    const { pre: Pre = "pre", code: Code = "code" } = options.components ?? {};
    return /* @__PURE__ */ jsx(Pre, { children: /* @__PURE__ */ jsx(Code, { children: code }) });
  });
  if (!options.engine && !jsEngine) {
    jsEngine = createJavaScriptRegexEngine();
  }
  useEffect(
    () => {
      void highlight(code, {
        ...options,
        engine: options.engine ?? jsEngine
      }).then(setOut);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- custom deps
    deps ?? [code, options.lang]
  );
  return out;
}
export {
  useShiki
};
