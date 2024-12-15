"use client";
import {
  Link
} from "./chunk-DVOZJZGH.js";
import "./chunk-MLKGABMK.js";

// src/dynamic-link.tsx
import { useParams } from "next/navigation";
import { forwardRef, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var DynamicLink = forwardRef(
  ({ href, ...props }, ref) => {
    const params = useParams();
    const url = useMemo(() => {
      return href?.replace(/\[.*]/, (key) => {
        const mappedKey = key.slice(1, -1);
        const value = mappedKey in params ? params[mappedKey] : void 0;
        if (!value) return "";
        return typeof value === "string" ? value : value.join("/");
      });
    }, [params, href]);
    return /* @__PURE__ */ jsx(Link, { ref, href: url, ...props });
  }
);
DynamicLink.displayName = "DynamicLink";
var dynamic_link_default = DynamicLink;
export {
  DynamicLink,
  dynamic_link_default as default
};
