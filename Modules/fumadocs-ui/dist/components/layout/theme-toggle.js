'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '../../utils/cn';
const buttonVariants = cva('size-7 rounded-full p-1.5 text-fd-muted-foreground', {
    variants: {
        dark: {
            true: 'dark:bg-fd-accent dark:text-fd-accent-foreground',
            false: 'bg-fd-accent text-fd-accent-foreground dark:bg-transparent dark:text-fd-muted-foreground',
        },
    },
});
export function ThemeToggle({ className, ...props }) {
    const { setTheme, resolvedTheme } = useTheme();
    const onToggle = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };
    return (_jsxs("button", { type: "button", className: cn('inline-flex items-center rounded-full border p-[3px]', className), "data-theme-toggle": "", "aria-label": "Toggle Theme", onClick: onToggle, ...props, children: [_jsx(Sun, { className: cn(buttonVariants({ dark: false })) }), _jsx(Moon, { className: cn(buttonVariants({ dark: true })) })] }));
}
