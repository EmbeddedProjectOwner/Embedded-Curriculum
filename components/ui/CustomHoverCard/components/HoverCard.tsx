"use client";

/* 
-----------------
    HoverCard
-----------------
*/

import * as React from "react";
import * as PopperPrimitive from "@radix-ui/react-popper";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { HOVERCARD_NAME, HoverCardProvider, usePopperScope } from "./scopes";
import { HoverCardProps } from "../types";

/**
 * HoverCard component providing delayed hover-based interactions.
 * @param __scopeHoverCard - Scope of the HoverCard.
 * @param children - Child elements of the HoverCard.
 * @param open - Controlled open state.
 * @param defaultOpen - Default open state.
 * @param onOpenChange - Callback when open state changes.
 * @param openDelay - Delay before opening the HoverCard.
 * @param closeDelay - Delay before closing the HoverCard.
*/
export const HoverCard: React.FC<HoverCardProps> = ({
    __scopeHoverCard,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
}) => {
    const popperScope = usePopperScope(__scopeHoverCard);
    const openTimerRef = React.useRef<number>(0);
    const closeTimerRef = React.useRef<number>(0);
    const hasSelectionRef = React.useRef<boolean>(false);
    const isPointerDownOnContentRef = React.useRef<boolean>(false);

    const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    });

    /** Opens the HoverCard with delay.*/
    const handleOpen = React.useCallback(() => {
        clearTimeout(closeTimerRef.current);
        openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
    }, [openDelay, setOpen]);

    /** Closes the HoverCard with delay.*/
    const handleClose = React.useCallback(() => {
        clearTimeout(openTimerRef.current);
        if (!hasSelectionRef.current && !isPointerDownOnContentRef.current) {
            closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
        }
    }, [closeDelay, setOpen]);

    /** Dismisses the HoverCard immediately.*/
    const handleDismiss = React.useCallback(() => setOpen(false), [setOpen]);

    // Cleanup timers on unmount
    React.useEffect(() => {
        return () => {
            clearTimeout(openTimerRef.current);
            clearTimeout(closeTimerRef.current);
        };
    }, []);


  

    return (
        <HoverCardProvider
            scope={__scopeHoverCard}
            open={open}
            onOpenChange={setOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            onDismiss={handleDismiss}
            hasSelectionRef={hasSelectionRef}
            isPointerDownOnContentRef={isPointerDownOnContentRef}
        >
            <PopperPrimitive.Root {...popperScope}>{children}</PopperPrimitive.Root>
        </HoverCardProvider>
    );
};

HoverCard.displayName = HOVERCARD_NAME;

