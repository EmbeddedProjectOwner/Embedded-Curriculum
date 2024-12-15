import { type MutableRefObject, type ReactNode } from 'react';
interface SidebarContext {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    /**
     * When set to false, don't close the sidebar when navigate to another page
     */
    closeOnRedirect: MutableRefObject<boolean>;
}
declare const SidebarContext: import("react").Context<SidebarContext | undefined>;
export declare function useSidebar(): SidebarContext;
export declare function SidebarProvider({ children, }: {
    children: ReactNode;
}): ReactNode;
export {};
//# sourceMappingURL=sidebar.d.ts.map