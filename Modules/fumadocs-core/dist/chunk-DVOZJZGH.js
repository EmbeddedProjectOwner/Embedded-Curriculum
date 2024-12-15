// src/link.tsx
import Original from "next/link";
import { forwardRef } from "react";
import { jsx } from "react/jsx-runtime";
var Link = forwardRef(
  ({
    href = "#",
    external = !(href.startsWith("/") || href.startsWith("#") || href.startsWith(".")),
    prefetch,
    replace,
    ...props
  }, ref) => {
    if (external) {
      return /* @__PURE__ */ jsx(
        "a",
        {
          ref,
          href,
          rel: "noreferrer noopener",
          target: "_blank",
          ...props,
          children: props.children
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Original,
      {
        ref,
        href,
        prefetch,
        replace,
        ...props
      }
    );
  }
);
Link.displayName = "Link";

export {
  Link
};
