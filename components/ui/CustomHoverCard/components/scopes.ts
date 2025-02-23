"use client";

import { createContextScope } from "@radix-ui/react-context";
import { HoverCardContextValue } from "../types";

/*
--------------
 Names
--------------
*/

/**
 * Name identifier for the HoverCard context.
*/
export const HOVERCARD_NAME = "HoverCard"

/**
 * Name identifier for the HoverCard portal context.
*/
export const PORTAL_NAME = "HoverCardPortal";

/**
 * Name identifier for the HoverCardTrigger.
*/
export const TRIGGER_NAME = "HoverCardTrigger";

/**
 * Name identifier for the HoverCardContent.
*/
export const CONTENT_NAME = "HoverCardContent";

/*
--------------
 Contexts
--------------
*/

/**
 * Creates the main HoverCard context and its scope.
*/
export const [createHoverCardContext, createHoverCardScope] = createContextScope(HOVERCARD_NAME);

/**
 * HoverCard context provider and hook.
*/
export const [HoverCardProvider, useHoverCardContext] = createHoverCardContext<HoverCardContextValue>(HOVERCARD_NAME);

/**
 * Popper context
*/
export const [createPopperContext, createPopperScope] = createContextScope("Popper");
export const [PopperContentProvider, useContentContext] = createPopperContext("Popper");
export const [PopperProvider, usePopperContext] = createPopperContext("Popper");
/**
 * Popper scope hook for managing popper positioning.
*/
export const usePopperScope = createPopperScope();



/**
 * Portal context provider and hook for managing the HoverCard portal.
*/
export const [PortalProvider, usePortalContext] = createHoverCardContext<{ forceMount?: true }>(
    PORTAL_NAME,
    { forceMount: undefined }
);