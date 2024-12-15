import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';
import { cn } from '../../utils/cn';
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (_jsxs(ScrollAreaPrimitive.Root, { ref: ref, className: cn('overflow-hidden', className), ...props, children: [children, _jsx(ScrollAreaPrimitive.Corner, {}), _jsx(ScrollBar, { orientation: "vertical" })] })));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollViewport = React.forwardRef(({ className, children, ...props }, ref) => (_jsx(ScrollAreaPrimitive.Viewport, { ref: ref, className: cn('size-full rounded-[inherit]', className), ...props, children: children })));
ScrollViewport.displayName = ScrollAreaPrimitive.Viewport.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (_jsx(ScrollAreaPrimitive.Scrollbar, { ref: ref, orientation: orientation, className: cn('flex select-none data-[state=hidden]:animate-fd-fade-out', orientation === 'vertical' && 'h-full w-1.5', orientation === 'horizontal' && 'h-1.5 flex-col', className), ...props, children: _jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-fd-border" }) })));
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;
export { ScrollArea, ScrollBar, ScrollViewport };