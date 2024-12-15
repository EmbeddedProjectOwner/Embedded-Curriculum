'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Check, ChevronRight, LinkIcon } from 'lucide-react';
import { forwardRef, useState, useEffect, } from 'react';
import { cn } from '../utils/cn';
import { useCopyButton } from '../utils/use-copy-button';
import { buttonVariants } from '../components/ui/button';
export const Accordions = forwardRef(({ type = 'single', className, defaultValue, ...props }, ref) => {
    const [value, setValue] = useState(type === 'single' ? (defaultValue ?? '') : (defaultValue ?? []));
    useEffect(() => {
        const id = window.location.hash.substring(1);
        if (id.length > 0)
            setValue((prev) => (typeof prev === 'string' ? id : [id, ...prev]));
    }, []);
    return (
    // @ts-expect-error -- Multiple types
    _jsx(AccordionPrimitive.Root, { type: type, ref: ref, value: value, onValueChange: setValue, collapsible: type === 'single' ? true : undefined, className: cn('divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card', className), ...props }));
});
Accordions.displayName = 'Accordions';
export const Accordion = forwardRef(({ title, className, id, children, ...props }, ref) => {
    return (_jsxs(AccordionPrimitive.Item, { ref: ref, 
        // Use `id` instead if presents
        value: id ?? title, className: cn('group/accordion relative scroll-m-20', className), ...props, children: [_jsxs(AccordionPrimitive.Header, { id: id, className: "not-prose flex flex-row items-center font-medium text-fd-foreground", children: [_jsxs(AccordionPrimitive.Trigger, { className: "flex flex-1 items-center gap-2 p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring", children: [_jsx(ChevronRight, { className: "-ms-1 size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[state=open]/accordion:rotate-90" }), title] }), id ? _jsx(CopyButton, { id: id }) : null] }), _jsx(AccordionPrimitive.Content, { className: "overflow-hidden data-[state=closed]:animate-fd-accordion-up data-[state=open]:animate-fd-accordion-down", children: _jsx("div", { className: "p-4 pt-0 prose-no-margin", children: children }) })] }));
});
function CopyButton({ id }) {
    const [checked, onClick] = useCopyButton(() => {
        const url = new URL(window.location.href);
        url.hash = id;
        void navigator.clipboard.writeText(url.toString());
    });
    return (_jsx("button", { type: "button", "aria-label": "Copy Link", className: cn(buttonVariants({
            color: 'ghost',
            className: 'text-fd-muted-foreground me-2',
        })), onClick: onClick, children: checked ? (_jsx(Check, { className: "size-3.5" })) : (_jsx(LinkIcon, { className: "size-3.5" })) }));
}
Accordion.displayName = 'Accordion';
