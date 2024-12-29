import React from "react";

export type LinkContextTypes = {
    TriggerLinks: boolean
    setTriggerLinks : (trigger: boolean) => void
}

export const LinkContext = React.createContext<LinkContextTypes>({
    TriggerLinks: false,
    setTriggerLinks: (trigger: boolean) => { console.log("trigger Is: " + trigger) }
})

export const useLinkContext = () => React.useContext(LinkContext)