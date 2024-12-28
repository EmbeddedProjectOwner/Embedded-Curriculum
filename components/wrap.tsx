"use client"

import scrollIntoView from "scroll-into-view-if-needed";
import { useEffect, useState } from "react";
import React from "react";

export function InlineTOC({ children }: { children: React.ReactElement }) {

    const [allChildrenReady, setAllChildrenReady] = useState(false);

    const handleChildReady = () => {
        setAllChildrenReady(!allChildrenReady);
    };



    useEffect(() => {
        if (allChildrenReady) {
            document.querySelectorAll("a").forEach((element) => {
                if (new URL(element.href).hash !== '') {
                    element.addEventListener("click", (ev) => {
                        ev.preventDefault();

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
            })
        }
    }, [allChildrenReady]);
    return (
        <>
            {React.Children.map(children, (child) => {

                console.log(React.cloneElement(child, { action: handleChildReady }))

                return (React.cloneElement(child, { action: handleChildReady }))
            }
            )}
        </>
    )
}