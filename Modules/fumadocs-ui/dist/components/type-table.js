'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Popover, PopoverContent, PopoverTrigger, } from '../components/ui/popover';
export function Info({ children }) {
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { children: _jsx(InfoIcon, { className: "size-4" }) }), _jsx(PopoverContent, { className: "prose max-h-[400px] min-w-[220px] max-w-[400px] overflow-auto text-sm prose-no-margin", children: children })] }));
}
const field = cva('inline-flex flex-row items-center gap-1');
const code = cva('rounded-md bg-fd-secondary p-1 text-fd-secondary-foreground', {
    variants: {
        color: { primary: 'bg-fd-primary/10 text-fd-primary' },
    },
});
export function TypeTable({ type }) {
    return (_jsx("div", { className: "prose my-6 overflow-auto prose-no-margin", children: _jsxs("table", { className: "whitespace-nowrap text-sm text-fd-muted-foreground", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "w-[45%]", children: "Prop" }), _jsx("th", { className: "w-[30%]", children: "Type" }), _jsx("th", { className: "w-1/4", children: "Default" })] }) }), _jsx("tbody", { children: Object.entries(type).map(([key, value]) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: field(), children: [_jsx("code", { className: cn(code({ color: 'primary' })), children: key }), value.description ? _jsx(Info, { children: value.description }) : null] }) }), _jsx("td", { children: _jsxs("div", { className: field(), children: [_jsx("code", { className: code(), children: value.type }), value.typeDescription ? (_jsx(Info, { children: value.typeDescription })) : null, value.typeDescriptionLink ? (_jsx(Link, { href: value.typeDescriptionLink, children: _jsx(InfoIcon, { className: "size-4" }) })) : null] }) }), _jsx("td", { children: value.default ? (_jsx("code", { className: code(), children: value.default })) : (_jsx("span", { children: "-" })) })] }, key))) })] }) }));
}
