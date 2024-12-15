import { ReactNode, ElementType, ComponentPropsWithoutRef, ReactElement } from 'react';

interface SidebarProviderProps {
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
    children: ReactNode;
}
declare function SidebarProvider(props: SidebarProviderProps): React.ReactElement;
type AsProps<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, 'as'> & {
    as?: T;
};
type SidebarTriggerProps<T extends ElementType> = AsProps<T>;
declare function SidebarTrigger<T extends ElementType = 'button'>({ as, ...props }: SidebarTriggerProps<T>): ReactElement;
type SidebarContentProps<T extends ElementType> = AsProps<T> & {
    /**
     * Disable scroll blocking when the viewport width is larger than a certain number (in pixels)
     */
    blockScrollingWidth?: number;
};
declare function SidebarList<T extends ElementType = 'aside'>({ as, blockScrollingWidth, ...props }: SidebarContentProps<T>): ReactElement;

export { type SidebarContentProps, SidebarList, SidebarProvider, type SidebarProviderProps, SidebarTrigger, type SidebarTriggerProps };
