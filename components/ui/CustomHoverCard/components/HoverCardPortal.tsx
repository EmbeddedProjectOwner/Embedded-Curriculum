"use client";

/*
---------------------------
    HoverCardPortal
---------------------------
*/

import { Presence } from "@radix-ui/react-presence";
import { usePortalContext, PORTAL_NAME, PortalProvider } from "./scopes";
import { HoverCardPortalProps } from "../types";
import { Portal as RadixPortal } from "@radix-ui/react-portal";

/**
 * HoverCardPortal component for managing the rendering of the HoverCard within a portal.
 * Provides context and conditional mounting for the HoverCard.
 * @param {HoverCardPortalProps} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements to render within the portal.
 * @param {HTMLElement} [props.container] - Optional container element for the portal.
 * @param {boolean} [props.forceMount] - Forces the portal to mount regardless of context state.
 * @returns {JSX.Element} The rendered HoverCardPortal component.
 */
export const HoverCardPortal: React.FC<HoverCardPortalProps> = ({
    __scopeHoverCard,
    children,
    container,
    forceMount,
}) => {
    const portalContext = usePortalContext(PORTAL_NAME, __scopeHoverCard);

    return (
        <PortalProvider scope={__scopeHoverCard} forceMount={forceMount}>
            {forceMount ? (
                <Presence present={forceMount}>
                    <RadixPortal container={container}>{children}</RadixPortal>
                </Presence>
            ) : (
                <RadixPortal container={container}>{children}</RadixPortal>
            )}
        </PortalProvider>
    );
};
HoverCardPortal.displayName = "HoverCardPortal";
