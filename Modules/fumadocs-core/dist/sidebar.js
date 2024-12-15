"use client";
import "./chunk-MLKGABMK.js";

// src/sidebar.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { RemoveScroll } from "react-remove-scroll";
import { jsx } from "react/jsx-runtime";
var SidebarContext = createContext(void 0);
function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("Missing sidebar provider");
  return ctx;
}
function SidebarProvider(props) {
  const [openInner, setOpenInner] = useState(false);
  return /* @__PURE__ */ jsx(
    SidebarContext.Provider,
    {
      value: [props.open ?? openInner, props.onOpenChange ?? setOpenInner],
      children: props.children
    }
  );
}
function SidebarTrigger({
  as,
  ...props
}) {
  const [open, setOpen] = useSidebarContext();
  const As = as ?? "button";
  return /* @__PURE__ */ jsx(
    As,
    {
      "aria-label": "Toggle Sidebar",
      "data-open": open,
      onClick: () => {
        setOpen(!open);
      },
      ...props
    }
  );
}
function SidebarList({
  as,
  blockScrollingWidth,
  ...props
}) {
  const [open] = useSidebarContext();
  const [isBlocking, setIsBlocking] = useState(false);
  useEffect(() => {
    if (!blockScrollingWidth) return;
    const mediaQueryList = window.matchMedia(
      `(min-width: ${blockScrollingWidth.toString()}px)`
    );
    const handleChange = () => {
      setIsBlocking(!mediaQueryList.matches);
    };
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [blockScrollingWidth]);
  return /* @__PURE__ */ jsx(
    RemoveScroll,
    {
      as: as ?? "aside",
      "data-open": open,
      enabled: Boolean(isBlocking && open),
      ...props,
      children: props.children
    }
  );
}
export {
  SidebarList,
  SidebarProvider,
  SidebarTrigger
};
