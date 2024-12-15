import type { TabsContentProps, TabsProps as BaseProps } from '@radix-ui/react-tabs';
import * as Primitive from './ui/tabs';
export { Primitive };
export interface TabsProps extends BaseProps {
    /**
     * Identifier for Sharing value of tabs
     */
    groupId?: string;
    /**
     * Enable persistent
     */
    persist?: boolean;
    /**
     * @defaultValue 0
     */
    defaultIndex?: number;
    items?: string[];
    /**
     * If true, updates the URL hash based on the tab's id
     */
    updateAnchor?: boolean;
}
export declare function Tabs({ groupId, items, persist, defaultIndex, updateAnchor, ...props }: TabsProps): import("react/jsx-runtime").JSX.Element;
export declare function Tab({ value, className, ...props }: TabsContentProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tabs.d.ts.map