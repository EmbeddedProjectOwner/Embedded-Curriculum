"use client"
import React, { ReactNode, useEffect, useState } from "react";
import scrollIntoView from "scroll-into-view-if-needed";

export function ScrollWrapper({ children }: { children: ReactNode }) {

    useEffect(() => {
        document.querySelectorAll("a").forEach((element) => {
            if (new URL(element.href).hash !== '') {
                element.addEventListener("click", (ev) => {
                    ev.preventDefault();

                    const hrefDiv = document.getElementById((new URL(element.href).hash).split("#")[1])
                    console.log(`${new URL(element.href).hash}`, hrefDiv)
                    if (hrefDiv) {
                        console.log(hrefDiv)
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

    }, [children])

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for the children to fully render
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (isReady) {
            // Your function to run after children are fully loaded
            console.log('Children are fully rendered');
        }
    }, [isReady]);
    return (
        <div>
            {children}

        </div>
    )
}