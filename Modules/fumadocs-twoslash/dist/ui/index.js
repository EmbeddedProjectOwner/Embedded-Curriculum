"use client";
import {
  __objRest,
  __spreadValues
} from "../chunk-ORMEWXMH.js";

// src/ui/popup.tsx
import {
  forwardRef as forwardRef2,
  useState,
  useRef,
  useContext,
  createContext,
  useMemo
} from "react";

// src/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

// src/ui/cn.ts
import { twMerge } from "tailwind-merge";

// src/ui/popover.tsx
import { jsx } from "react/jsx-runtime";
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React.forwardRef((_a, ref) => {
  var _b = _a, { className, align = "center", sideOffset = 4 } = _b, props = __objRest(_b, ["className", "align", "sideOffset"]);
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    __spreadValues({
      ref,
      align,
      sideOffset,
      side: "bottom",
      className: twMerge("fd-twoslash-popover", className)
    }, props)
  ) });
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// src/ui/popup.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var PopupContext = createContext(void 0);
function Popup({
  delay = 300,
  children
}) {
  const [open, setOpen] = useState(false);
  const openTimeoutRef = useRef();
  const closeTimeoutRef = useRef();
  const handleOpen = (e) => {
    if (e.pointerType === "touch") return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    openTimeoutRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delay);
  };
  const handleClose = (e) => {
    if (e.pointerType === "touch") return;
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, delay);
  };
  return /* @__PURE__ */ jsx2(Popover, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsx2(
    PopupContext.Provider,
    {
      value: useMemo(
        () => ({
          open,
          setOpen,
          handleOpen,
          handleClose
        }),
        [handleClose, handleOpen, open]
      ),
      children
    }
  ) });
}
var PopupTrigger = forwardRef2((props, ref) => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("Missing Popup Context");
  return /* @__PURE__ */ jsx2(
    PopoverTrigger,
    __spreadValues({
      ref,
      onPointerEnter: ctx.handleOpen,
      onPointerLeave: ctx.handleClose
    }, props)
  );
});
PopupTrigger.displayName = "PopupTrigger";
var PopupContent = forwardRef2((props, ref) => {
  const ctx = useContext(PopupContext);
  if (!ctx) throw new Error("Missing Popup Context");
  return /* @__PURE__ */ jsx2(
    PopoverContent,
    __spreadValues({
      ref,
      onPointerEnter: ctx.handleOpen,
      onPointerLeave: ctx.handleClose,
      onCloseAutoFocus: (e) => {
        e.preventDefault();
      }
    }, props)
  );
});
PopupContent.displayName = "PopupContent";
export {
  Popup,
  PopupContent,
  PopupTrigger
};
