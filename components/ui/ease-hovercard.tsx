import React from "react";
import { HoverCard } from "../shadcn";

interface ReactProps {
    Content: typeof HoverCard.HoverCardContent.propTypes,
    Trigger: typeof HoverCard.HoverCardTrigger.propTypes
}
interface HoverCardProps {
    Trigger: React.ReactNode,
    Content: React.ReactNode
    Props: {}
}

export function HoverCardInline(InlineProps: HoverCardProps) {
    return (
        <HoverCard.HoverCard>
            <HoverCard.HoverCardContent {...InlineProps.Props.Cont}></HoverCard.HoverCardContent>
        </HoverCard.HoverCard>
    )
}