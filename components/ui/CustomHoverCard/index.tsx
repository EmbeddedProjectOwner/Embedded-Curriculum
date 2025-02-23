"use client";
/**
 * @module HoverCard
 * @author @SomePogProgrammer
 * @coauthor RadixUI 
 * 
 * This is based off of the RadixUI hovercard, I don't claim over this, I edited it to be more readable and less compiled for maintainence.
 */


import * as React from "react";
import * as PopperPrimitive from "@radix-ui/react-popper";

// Components 
import { HoverCard } from "./components/HoverCard";
import { HoverCardPortal } from "./components/HoverCardPortal";
import { HoverCardContent } from "./components/HoverCardContext";
import { HoverCardTrigger } from "./components/HoverCardTrigger";

// Scopes 
import { HoverCardArrowProps } from "./types";
import { createHoverCardScope } from "./components/scopes";

/**
 * HoverCardArrow component for rendering an arrow on the hover card.
 * @param {HoverCardArrowProps} props - Component properties.
 * @param {React.Ref<SVGSVGElement>} ref - Forwarded ref.
*/
const HoverCardArrow = React.forwardRef<SVGSVGElement, HoverCardArrowProps>(
    ({ __scopeHoverCard, ...props }, ref) => {
        return (<PopperPrimitive.Arrow {...props} ref={ref} />);
    }
);

HoverCardArrow.displayName = "HoverCardArrow";

/*
----------------------------
 Exported Components
----------------------------
*/

export {
    HoverCard,
    HoverCardTrigger,
    HoverCardPortal,
    HoverCardContent,
    HoverCardArrow,
    createHoverCardScope
};