"use client";
//import type { TOCItemType } from 'fumadocs-core/server';
/*export interface InlineTocProps {
  items: TOCItemType[];
  defaultOpen?: boolean;
  action: () => void
}*/

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useLinkContext } from "../../../../app/Contexts/client/linkContext"

export function InlineTOC({ items, defaultOpen}/* : InlineTocProps*/) {
  const { setTriggerLinks, TriggerLinks } = useLinkContext()

  return _jsxs(Collapsible, {
    defaultOpen: defaultOpen,
    onOpenChange: (isOpen) => {
      if (isOpen) {
        setTriggerLinks(!TriggerLinks)
      } else {
        setTriggerLinks(!TriggerLinks)
      }
    },
    className: "not-prose rounded-lg border bg-fd-card text-fd-card-foreground",
    children: [
      _jsxs(CollapsibleTrigger, {
        className:
          "inline-flex w-full items-center justify-between p-4 font-medium [&[data-state=open]>svg]:rotate-180",
        children: [
          "Table of Contents",
          _jsx(ChevronDown, {
            className: "size-4 transition-transform duration-200",
          }),
        ],
      }),
      _jsx(CollapsibleContent, {
        children: _jsx("div", {
          className: "flex flex-col p-4 pt-0 text-sm text-fd-muted-foreground",
          children: items.map((item) =>
            _jsx(
              "a",
              {
                href: item.url,
                className: "border-l py-1.5 hover:text-fd-accent-foreground",
                style: {
                  paddingLeft: 12 * Math.max(item.depth - 1, 0),
                },
                children: item.title,
              },
              item.url
            )
          ),
        }),
      }),
    ],
  });
}

