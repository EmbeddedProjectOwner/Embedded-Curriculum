import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, CircleX, Info } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../utils/cn';
export const Callout = forwardRef(({ className, children, title, type = 'info', icon, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn('my-6 flex flex-row gap-2 rounded-lg border bg-fd-card p-3 text-sm text-fd-card-foreground shadow-md', className), ...props, children: [icon ??
                {
                    info: _jsx(Info, { className: "size-5 fill-blue-500 text-fd-card" }),
                    warn: (_jsx(AlertTriangle, { className: "size-5 fill-orange-500 text-fd-card" })),
                    error: _jsx(CircleX, { className: "size-5 fill-red-500 text-fd-card" }),
                }[type], _jsxs("div", { className: "min-w-0 flex-1", children: [title ? _jsx("p", { className: "not-prose mb-2 font-medium", children: title }) : null, _jsx("div", { className: "text-fd-muted-foreground prose-no-margin", children: children })] })] }));
});
Callout.displayName = 'Callout';
