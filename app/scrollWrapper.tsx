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
            const element = element_ as HTMLAnchorElement_
            if (element.href.includes("://") && new URL(element.href)) {
            var elementURL = new URL(element.href)

            if (elementURL.hash !== '' && elementURL.pathname == currentPath && !element._smoothScroll) {
                element.addEventListener("click", (ev) => {
                    element._smoothScroll = true

                    ev.preventDefault();
                    router.replace(element.href, {scroll: false}) 


                    const hrefDiv = document.getElementById((new URL(element.href).hash).split("#")[1])
                    if (hrefDiv) {
                        scrollIntoView(hrefDiv, {
                            behavior: "smooth",
                            block: "start",
                            inline: "center",
                            scrollMode: "always",
                            boundary: document.getElementById("nd-toc")
                        });

                    }
                    
                })
            }
    }})
    }, [TriggerLinks]);

    useEffect(() => {
        setTriggerLinks((previousState) => !previousState)
    }, [children])

    return (
        <LinkContext.Provider value={{ TriggerLinks, setTriggerLinks }}>{children}</LinkContext.Provider>
    )
}