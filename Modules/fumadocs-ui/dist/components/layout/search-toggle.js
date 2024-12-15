'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SearchIcon } from 'lucide-react';
import { useSearchContext } from '../../contexts/search';
import { useI18n } from '../../contexts/i18n';
import { cn } from '../../utils/cn';
import { buttonVariants } from '../../components/ui/button';
export function SearchToggle(props) {
    const { setOpenSearch } = useSearchContext();
    return (_jsx("button", { type: "button", className: cn(buttonVariants({
            size: 'icon',
            color: 'ghost',
            className: props.className,
        })), "data-search": "", "aria-label": "Open Search", onClick: () => {
            setOpenSearch(true);
        }, children: _jsx(SearchIcon, {}) }));
}
export function LargeSearchToggle(props) {
    const { hotKey, setOpenSearch } = useSearchContext();
    const { text } = useI18n();
    return (_jsxs("button", { type: "button", "data-search-full": "", ...props, className: cn('inline-flex items-center gap-2 rounded-full border bg-fd-secondary/50 p-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground', props.className), onClick: () => {
            setOpenSearch(true);
        }, children: [_jsx(SearchIcon, { className: "ms-1 size-4" }), text.search, _jsx("div", { className: "ms-auto inline-flex gap-0.5", children: hotKey.map((k, i) => (_jsx("kbd", { className: "rounded-md border bg-fd-background px-1.5", children: k.display }, i))) })] }));
}
