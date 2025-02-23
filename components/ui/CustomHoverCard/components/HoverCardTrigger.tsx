"use client";

/*
-----------------------------
    HoverCardTrigger
-----------------------------
*/

import React from "react";
import * as PopperPrimitive from "@radix-ui/react-popper";
import { Primitive } from "@radix-ui/react-primitive";
import { HoverCardTriggerProps } from "../types";
import { useHoverCardContext, TRIGGER_NAME, usePopperScope } from "./scopes";


/**
 * HoverCardTrigger component for controlling the visibility of the HoverCard.
 * Acts as an anchor element and manages pointer, focus, and touch interactions.
 * @param {HoverCardTriggerProps} props - Component properties.
 * @param {React.Ref<HTMLAnchorElement>} forwardedRef - Forwarded ref.
 * @returns {JSX.Element} The rendered HoverCardTrigger component.
 */
export const HoverCardTrigger = React.forwardRef<HTMLAnchorElement, HoverCardTriggerProps>(
    (props, forwardedRef) => {
        const { __scopeHoverCard, onPointerEnter, onPointerLeave, onFocus, onBlur, onTouchStart, ...triggerProps } = props;
        const context = useHoverCardContext(TRIGGER_NAME, __scopeHoverCard);
        const popperScope = usePopperScope(__scopeHoverCard);

        return (
            <PopperPrimitive.Anchor asChild {...popperScope}>
                <Primitive.a
                    data-state={context.open ? "open" : "closed"}
                    {...triggerProps}
                    ref={forwardedRef}
                    onPointerEnter={(event) => {
                        onPointerEnter?.(event);
                        if (!event.defaultPrevented) context.onOpen();
                    }}
                    onPointerLeave={(event) => {
                        onPointerLeave?.(event);
                        if (!event.defaultPrevented) context.onClose();
                    }}
                    onFocus={(event) => {
                        onFocus?.(event);
                        if (!event.defaultPrevented) context.onOpen();
                    }}
                    onBlur={(event) => {
                        onBlur?.(event);
                        if (!event.defaultPrevented) context.onClose();
                    }}
                    onTouchStart={(event) => {
                        onTouchStart?.(event);
                        event.preventDefault();
                    }}
                />
            </PopperPrimitive.Anchor>
        );
    }
);

HoverCardTrigger.displayName = TRIGGER_NAME;
