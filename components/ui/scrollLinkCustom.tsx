"use client";
import Link from "next/link";
import React from "react";

export const ScrollToLink = ({id, children} : {id: string, children: React.ReactNode}) => {
  
    if (id) {
        return (
            <Link href={`#${id}`} onClick={(e) => {
                e.preventDefault()

              var element = document.getElementById(id)
              if (element) {
                
               element.scrollIntoView({behavior: "smooth", block: "center"})
               element.style.boxShadow = '0 0 11px 1.25px rgb(13, 107, 196)';
               setTimeout(() => {
                if (element) {
                    element.style.boxShadow = 'none';
                }
               }, 1350)
              }
            }}>{children}</Link>
        )
    } else return (<></>)
}