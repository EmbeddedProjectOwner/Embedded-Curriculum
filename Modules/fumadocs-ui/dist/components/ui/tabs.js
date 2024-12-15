'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '../../utils/cn';
const Tabs = React.forwardRef((props, ref) => {
    return (_jsx(TabsPrimitive.Root, { ref: ref, ...props, className: cn('flex flex-col overflow-hidden rounded-xl border bg-fd-card', props.className) }));
});
Tabs.displayName = 'Tabs';
const TabsList = React.forwardRef((props, ref) => (_jsx(TabsPrimitive.List, { ref: ref, ...props, className: cn('flex flex-row items-end gap-4 overflow-x-auto bg-fd-secondary px-4 text-fd-muted-foreground', props.className) })));
TabsList.displayName = 'TabsList';
const TabsTrigger = React.forwardRef((props, ref) => (_jsx(TabsPrimitive.Trigger, { ref: ref, ...props, className: cn('whitespace-nowrap border-b border-transparent py-2 text-sm font-medium transition-colors hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary', props.className) })));
TabsTrigger.displayName = 'TabsTrigger';
const TabsContent = React.forwardRef((props, ref) => (_jsx(TabsPrimitive.Content, { ref: ref, ...props, className: cn('p-4', props.className) })));
TabsContent.displayName = 'TabsContent';
export { Tabs, TabsList, TabsTrigger, TabsContent };
