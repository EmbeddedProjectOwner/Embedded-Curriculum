"use client"
import React, { ReactNode, useEffect, useState } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { LinkContext, useLinkContext } from "./Contexts/client/linkContext";
import { usePathname, useRouter } from "next/navigation";


export function ScrollWrapper({ children }: { children: ReactNode }) {
    const [TriggerLinks, setTriggerLinks] = React.useState(false)
    const router = useRouter()
    const currentPath = usePathname()

    interface HTMLAnchorElement_ extends HTMLAnchorElement {
        _smoothScroll: boolean
    }

    useEffect(() => {
        document.querySelectorAll("a").forEach((element_) => {
          const element = element_ as HTMLAnchorElement_;
      
          // Check if the element already has the _smoothScroll flag to avoid duplicate listeners
          if (
            element.href.includes("://") &&
            new URL(element.href) &&
            !element._smoothScroll
          ) {
            const elementURL = new URL(element.href);
      
            if (elementURL.hash !== "" && elementURL.pathname === currentPath) {
              element._smoothScroll = true; // Set a flag to indicate listener is added
      
              element.addEventListener("click", (ev) => {
                ev.preventDefault();
      
                const hrefDiv = document.getElementById(
                  elementURL.hash.split("#")[1]
                );
                if (hrefDiv) {
                  scrollIntoView(hrefDiv, {
                    behavior: "smooth",
                    block: "start",
                    inline: "center",
                    scrollMode: "always",
                    boundary: document.getElementById("nd-toc"),
                  });
      
                  router.replace(element.href, { scroll: false }); // Runs only when the event is triggered
                }
              });
            }
          }
        });
      }, [TriggerLinks, currentPath]); // Dependencies: TriggerLinks or currentPath changes
    useEffect(() => {
        setTriggerLinks((previousState) => !previousState)
    }, [children])

    return (
        <LinkContext.Provider value={{ TriggerLinks, setTriggerLinks }}>{children}</LinkContext.Provider>
    )
}