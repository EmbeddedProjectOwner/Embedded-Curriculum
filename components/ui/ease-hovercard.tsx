import React from "react";
import { HoverCard } from "../shadcn";
interface ReactProps {
    Props: {
        Content: React.ComponentProps<typeof HoverCard.HoverCardContent>,
        Trigger: React.ComponentProps<typeof HoverCard.HoverCardTrigger>
    }
}
interface HoverCardProps extends ReactProps {
    Trigger: React.ReactNode | "children",
    Content: React.ReactNode | string,
    children: React.ReactNode,
}

export function HoverCardInline({ Props, Trigger, Content, children }: HoverCardProps) {
    if (!Props) {
        Props = {
            Content: {},
            Trigger: {}
        }
    }
    return (
        <HoverCard.HoverCard>
            <HoverCard.HoverCardTrigger {...(Props.Trigger ? Props.Trigger : {})} className="underline">{
                (Trigger ?
                    (Trigger !== "children") ? Trigger : children
                    : "__Hover Over Me!__")
            }
            </HoverCard.HoverCardTrigger>
            <HoverCard.HoverCardContent className="text-sm min-w-[20vw]" {...(Props.Content ? Props.Content : {})}>{Content ? (Content) : children}
            </HoverCard.HoverCardContent>
        </HoverCard.HoverCard>
    )
}