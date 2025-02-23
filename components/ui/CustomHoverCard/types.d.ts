/**
 * @module HoverCard
 * @author @SomePogProgrammer
 * @coauthor RadixUI 
 * 
 * This is based off of the RadixUI hovercard, I don't claim over this, I edited it to be more readable and less compiled for maintainence.
 */

import { Primitive } from "@radix-ui/react-primitive";
import * as PopperPrimitive from "@radix-ui/react-popper";

/* 
-----------------------------
   Type Definitions
----------------------------
*/

// Context types
/**
 * Context value for the HoverCard component.
*/
export type HoverCardContextValue = {
    /** Tracks if there is a text selection inside the card.*/
    hasSelectionRef: React.MutableRefObject<boolean>;
    /** Tracks if the pointer is down on the content area.*/
    isPointerDownOnContentRef: React.MutableRefObject<boolean>;
    /** Controls the open state of the card.*/
    open: boolean | undefined;
    /** Callback when open state changes.*/
    onOpenChange: (open: boolean) => void;
    /** Opens the card.*/
    onOpen: () => void;
    /** Closes the card.*/
    onClose: () => void;
    /** Dismisses the card.*/
    onDismiss: () => void;
};

/**
 * Context value for the portal component.
*/
export type PortalContextValue = {
    /** Forces the portal to mount.*/
    forceMount?: true;
};

// Component prop types
/**
 * Props for the HoverCard component.
*/
export interface HoverCardProps {
    /** Scope of the HoverCard.*/
    __scopeHoverCard?: any;
    /** Children elements of the HoverCard.*/
    children?: React.ReactNode;
    /** Controls the open state of the HoverCard.*/
    open?: boolean;
    /** Default open state of the HoverCard.*/
    defaultOpen?: boolean;
    /** Callback when open state changes.*/
    onOpenChange?: (open: boolean) => void;
    /** Delay before opening the HoverCard.*/
    openDelay?: number;
    /** Delay before closing the HoverCard.*/
    closeDelay?: number;
}

/**
 * Props for a primitive link component used as the trigger.
*/
export type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>;

/**
 * Props for the HoverCardTrigger component.
*/
export interface HoverCardTriggerProps extends PrimitiveLinkProps {
    /** Scope of the HoverCardTrigger.*/
    __scopeHoverCard?: any;
}

/**
 * Props for the HoverCardPortal component.
*/
export interface HoverCardPortalProps {
    /** Scope of the HoverCardPortal.*/
    __scopeHoverCard?: any;
    /** Children elements inside the portal.*/
    children?: React.ReactNode;
    /** Container element for the portal.*/
    container?: HTMLElement;
    /** Forces the portal to mount.*/
    forceMount?: true;
}

// Utility function return types
/**
 * Represents a list of tabbable HTML elements.
*/
export type TabbableNodes = HTMLElement[];

// Additional types
/**
 * Props for the DismissableLayer component.
*/
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;

/**
 * Props for the PopperPrimitive.Content component.
*/
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content> & {__scopePopper?: any, stayRelative?: boolean};

/**
 * Props for the HoverCardContent component.
*/
interface HoverCardContentProps extends Omit<PopperContentProps, "onPlaced"> {
    /** Scope of the HoverCardContent.*/
    __scopeHoverCard?: any;
    /** Forces the component to mount.*/
    forceMount?: true;
    /** Callback for escape key down event.*/
    onEscapeKeyDown?: DismissableLayerProps["onEscapeKeyDown"];
    /** Callback for pointer down outside event.*/
    onPointerDownOutside?: DismissableLayerProps["onPointerDownOutside"];
    /** Callback for focus outside event.*/
    onFocusOutside?: DismissableLayerProps["onFocusOutside"];
    /** Callback for interact outside event.*/
    onInteractOutside?: DismissableLayerProps["onInteractOutside"];
}

/**
 * Props for the PopperPrimitive.Arrow component.
*/
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;

/**
 * Props for the HoverCardArrow component.
*/
interface HoverCardArrowProps extends PopperArrowProps {
    /** Scope of the HoverCardArrow.*/
    __scopeHoverCard?: any;
}

/* Props for Popper Content */
interface PopperContentProps extends PrimitiveDivProps {
    side?: Side;
    sideOffset?: number;
    align?: Align;
    alignOffset?: number;
    arrowPadding?: number;
    avoidCollisions?: boolean;
    collisionBoundary?: Boundary | Boundary[];
    collisionPadding?: number | Partial<Record<Side, number>>;
    sticky?: 'partial' | 'always';
    hideWhenDetached?: boolean;
    updatePositionStrategy?: 'optimized' | 'always';
    onPlaced?: () => void;
    __scopePopper?: any;
}