"use client";

/* 
-------------------------
    HoverCardContent
-------------------------
*/

import React, { useLayoutEffect } from "react";
import { usePortalContext, CONTENT_NAME, useHoverCardContext, usePopperScope, PopperContentProvider } from "./scopes";
import { HoverCardContentProps, PopperContentProps } from "../types";
import { getTabbableNodes } from "../lib/util";
import { Presence } from "@radix-ui/react-presence";
import { useComposedRefs } from "@radix-ui/react-compose-refs"
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import * as PopperPrimitive from "@radix-ui/react-popper";
import { Primitive } from "@radix-ui/react-primitive";
import {
    useFloating,
    autoUpdate,
    offset,
    shift,
    limitShift,
    hide,
    arrow as floatingUIarrow,
    flip,
    size,
    Placement
  } from "@floating-ui/react-dom";
  import { useSize } from "@radix-ui/react-use-size";
  
/**
 * HoverCardContent component manages content visibility and mouse interactions.
 * @param {HoverCardContentProps} props - Component properties.
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref.
*/
export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
    (props, ref) => {
        const portalContext = usePortalContext(CONTENT_NAME, props.__scopeHoverCard);
        const { forceMount = portalContext.forceMount as true, ...contentProps } = props;
        const context = useHoverCardContext(CONTENT_NAME, props.__scopeHoverCard);

        return (
            <Presence present={forceMount || context.open}>
                <HoverCardContentImpl
                    forceMount={true}
                    data-state={context.open ? "open" : "closed"}
                    {...contentProps}
                    onMouseEnter={context.onOpen}
                    onMouseLeave={context.onClose}
                    ref={ref}
                />
            </Presence>
        );
    }
);

HoverCardContent.displayName = CONTENT_NAME;

/**
 * Implementation of the HoverCardContent component.
 * Manages text selection, interaction behavior, and accessibility.
 * @param {HoverCardContentProps} props - Component properties.
 * @param {React.Ref<HTMLDivElement>} forwardedRef - Forwarded ref.
*/
var POPPER_NAME = "Popper"
import { createContextScope } from "@radix-ui/react-context";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);

export const HoverCardContentImpl = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
    (props, forwardedRef) => {
        const {
            forceMount,
            __scopeHoverCard,
            onEscapeKeyDown,
            onPointerDownOutside,
            onFocusOutside,
            onInteractOutside,
            ...contentProps
        } = props;

        const context = useHoverCardContext(CONTENT_NAME, __scopeHoverCard);
        const popperScope = usePopperScope(__scopeHoverCard);
        const ref = React.useRef<HTMLDivElement>(null);
        const composedRefs = useComposedRefs(forwardedRef, ref);
        const [containSelection, setContainSelection] = React.useState(false);

        // Disable text selection when needed
        React.useEffect(() => {
            if (containSelection) {
                const body = document.body;
                const originalUserSelect = body.style.userSelect || body.style.webkitUserSelect;
                body.style.userSelect = "none";
                body.style.webkitUserSelect = "none";

                return () => {
                    body.style.userSelect = originalUserSelect;
                    body.style.webkitUserSelect = originalUserSelect;
                };
            }
        }, [containSelection]);

        // Handle pointer up events to manage selection state
        React.useEffect(() => {
            if (ref.current) {
                const handlePointerUp = () => {
                    setContainSelection(false);
                    context.isPointerDownOnContentRef.current = false;
                    setTimeout(() => {
                        const hasSelection = document.getSelection()?.toString() !== "";
                        if (hasSelection) context.hasSelectionRef.current = true;
                    });
                };

                document.addEventListener("pointerup", handlePointerUp);
                return () => {
                    document.removeEventListener("pointerup", handlePointerUp);
                    context.hasSelectionRef.current = false;
                    context.isPointerDownOnContentRef.current = false;
                };
            }
        }, [context]);

        // Set tabbable elements to tabindex="-1" so they don't get focus
        React.useEffect(() => {
            if (ref.current) {
                const tabbables = getTabbableNodes(ref.current);
                tabbables.forEach((tabbable) => tabbable.setAttribute("tabindex", "-1"));
            }
        });

        return (
            <DismissableLayer
                asChild
                disableOutsidePointerEvents={false}
                onInteractOutside={onInteractOutside}
                onEscapeKeyDown={onEscapeKeyDown}
                onPointerDownOutside={onPointerDownOutside}
                onFocusOutside={(event) => {
                    onFocusOutside?.(event);
                    event.preventDefault();
                }}
                onDismiss={context.onDismiss}
            >
                {/*<PopperPrimitive.Content*/}
                <PopperContent
                    {...popperScope}
                    {...contentProps}
                    ref={composedRefs}
                    data-state={context.open ? "open" : "closed"}
                    onPointerDown={(event) => {
                        contentProps.onPointerDown?.(event);
                        if (event.currentTarget.contains(event.target as Node)) {
                            setContainSelection(true);
                        }
                        context.hasSelectionRef.current = false;
                        context.isPointerDownOnContentRef.current = true;
                    }}
                    style={{
                        ...contentProps.style,
                        userSelect: containSelection ? "text" : undefined,
                        WebkitUserSelect: containSelection ? "text" : undefined,
                        //@ts-ignore
                        "--radix-hover-card-content-transform-origin": "var(--radix-popper-transform-origin)",
                        "--radix-hover-card-content-available-width": "var(--radix-popper-available-width)",
                        "--radix-hover-card-content-available-height": "var(--radix-popper-available-height)",
                        "--radix-hover-card-trigger-width": "var(--radix-popper-anchor-width)",
                        "--radix-hover-card-trigger-height": "var(--radix-popper-anchor-height)"
                    }}
                />
            </DismissableLayer>
        );
    }
);

HoverCardContentImpl.displayName = `${CONTENT_NAME}Impl`;


function useCallbackRef(callback: any) {
    const callbackRef = React.useRef(callback);

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return React.useCallback((...args: any) => callbackRef.current?.(...args), []);
}

// Lel idk who made this (I got it from the radix-ui popper module.mjs)
function isNotNull(value: any) {
    return value !== null;
}

var transformOrigin = (options: { arrowWidth: any; arrowHeight: any; }) => ({
    name: "transformOrigin",
    options,
    fn(data: { placement: any; rects: any; middlewareData: any; }) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign] as string;
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  });
  function getSideAndAlignFromPlacement(placement: string) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
// ---------------------
// PopperContent Component
// ---------------------

/**
 * PopperContent component for managing popover positioning, alignment, and visibility.
 * Utilizes floating UI middleware for collision detection, offsetting, and resizing.
 * 
 * @param {Object} props - Component properties.
 * @param {string} [props.side="bottom"] - Preferred side for popper placement.
 * @param {number} [props.sideOffset=0] - Offset from the anchor element along the main axis.
 * @param {string} [props.align="center"] - Alignment of the popper relative to the anchor.
 * @param {number} [props.alignOffset=0] - Offset from the anchor along the cross axis.
 * @param {number} [props.arrowPadding=0] - Padding around the arrow element.
 * @param {boolean} [props.avoidCollisions=true] - Whether to avoid element collisions.
 * @param {Array} [props.collisionBoundary=[]] - Elements that define the collision boundary.
 * @param {number|Object} [props.collisionPadding=0] - Padding for collision detection.
 * @param {string} [props.sticky="partial"] - Sticky behavior for shifting.
 * @param {boolean} [props.hideWhenDetached=false] - Hide when detached from the anchor.
 * @param {string} [props.updatePositionStrategy="optimized"] - Strategy for position updates.
 * @param {Function} [props.onPlaced] - Callback fired when the popper is positioned.
 * @param {React.Ref} forwardedRef - Forwarded ref for the popper element.
 * @returns {JSX.Element} The rendered PopperContent component.
 */
 
const PopperContent = React.forwardRef<HTMLDivElement,PopperContentProps>((props, forwardedRef) => {
    const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        stayRelative,
        ...contentProps
    } = props;

    const context = usePopperContext(CONTENT_NAME, __scopePopper) as any;
    const [content, setContent] = React.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node as any));
    const [arrow, setArrow] = React.useState(null);
    const arrowSize = useSize(arrow);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;

    const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull) as any,
        altBoundary: hasExplicitBoundaries
    };

    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        strategy: "fixed",
        placement: desiredPlacement as Placement,
        whileElementsMounted: (...args) => autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
        }),
        elements: { reference: context.anchor },
        middleware: [
            offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
            avoidCollisions && shift({
                mainAxis: true,
                crossAxis: false,
                limiter: sticky === "partial" ? limitShift() : undefined,
                ...detectOverflowOptions
            }),
            avoidCollisions && flip({ ...detectOverflowOptions }),
            size({
                ...detectOverflowOptions,
                apply: ({ elements, rects, availableWidth, availableHeight }) => {
                    const { width: anchorWidth, height: anchorHeight } = rects.reference;
                    const contentStyle = elements.floating.style;
                    contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
                    contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
                    contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
                    contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
                }
            }),
            arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
            transformOrigin({ arrowWidth, arrowHeight }),
            hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
    });

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef(onPlaced);
   
    useLayoutEffect(() => {
        if (isPositioned) handlePlaced?.();
    }, [isPositioned, handlePlaced]);

    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const [contentZIndex, setContentZIndex] = React.useState<any>();

    useLayoutEffect(() => {
        if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);

    return (
        <div
            ref={refs.setFloating}
            data-radix-popper-content-wrapper=""
            style={{
                ...(!stayRelative ? floatingStyles : {}),
                ...(!stayRelative ? {transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)"} : {position: "relative", width: "100%"}) ,
                minWidth: "max-content",
                zIndex: contentZIndex,
                // @ts-ignore
                ["--radix-popper-transform-origin"]: [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
                ...(middlewareData.hide?.referenceHidden && {
                    visibility: "hidden",
                    pointerEvents: "none"
                })
            }}
            dir={props.dir}
        >
            <PopperContentProvider
                scope={__scopePopper}
                // @ts-ignore
                placedSide={placedSide}
                onArrowChange={setArrow}
                arrowX={arrowX}
                arrowY={arrowY}
                shouldHideArrow={cannotCenterArrow}
            >
                <Primitive.div
                    data-side={placedSide}
                    data-align={placedAlign}
                    {...contentProps}
                    ref={composedRefs}
                    style={{
                        ...contentProps.style,
                        animation: !isPositioned ? "none" : undefined
                    }}
                />
            </PopperContentProvider>
        </div>
    );
});

PopperContent.displayName = CONTENT_NAME;

