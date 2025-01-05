import React from "react";

export type DialogContext = {
    isOpen : boolean,
    setIsOpen : (open: boolean) => void
}

export const SearchDialogContext = React.createContext<DialogContext>({
    isOpen : false,
    setIsOpen : (open: boolean) => { }
})

export const useSearchDialogContext = () => React.useContext(SearchDialogContext)