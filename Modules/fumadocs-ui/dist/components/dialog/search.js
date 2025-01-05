'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, Hash, Loader2, SearchIcon, Text } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect, useState, useRef, useCallback, } from 'react';
import { useI18n } from '../../contexts/i18n';
import { cn } from '../../utils/cn';
import { useSearchContext } from '../../contexts/search';
import { useSidebar } from '../../contexts/sidebar';
import { buttonVariants } from '../../components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, } from '@radix-ui/react-dialog';
export function SearchDialog({ open, onOpenChange, footer, links = [], ...props }) {
    const { text } = useI18n();
    const defaultItems = useMemo(() => links.map(([name, link]) => ({
        type: 'page',
        id: name,
        content: name,
        url: link,
    })), [links]);
    return (_jsxs(Dialog, { open: open, onOpenChange: onOpenChange, children: [_jsx(DialogOverlay, { className: "fixed inset-0 z-50 bg-fd-background/50 backdrop-blur-sm data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in" }), _jsxs(DialogContent, { "aria-describedby": undefined, className: "fixed left-1/2 top-[10vh] z-50 w-[98vw] max-w-screen-sm origin-left -translate-x-1/2 rounded-lg border bg-fd-popover text-fd-popover-foreground shadow-lg data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in", children: [_jsx(DialogTitle, { className: "hidden", children: text.search }), _jsx(SearchInput, { search: props.search, onSearchChange: props.onSearchChange, isLoading: props.isLoading }), _jsx(SearchList, { items: props.results === 'empty' ? defaultItems : props.results, hideResults: props.results === 'empty' && defaultItems.length === 0 }), footer ? (_jsx("div", { className: "mt-auto flex flex-col border-t p-3", children: footer })) : null] })] }));
}
const icons = {
    text: _jsx(Text, { className: "size-4 text-fd-muted-foreground" }),
    heading: _jsx(Hash, { className: "size-4 text-fd-muted-foreground" }),
    page: _jsx(FileText, { className: "size-4 text-fd-muted-foreground" }),
};
function SearchInput({ search, onSearchChange, isLoading }) {
    const { text } = useI18n();
    const { setOpenSearch } = useSearchContext();
    return (_jsxs("div", { className: "flex flex-row items-center gap-2 px-3", children: [_jsx(LoadingIndicator, { isLoading: isLoading ?? false }), _jsx("input", { value: search, onChange: (e) => {
                    onSearchChange(e.target.value);
                }, placeholder: text.search, className: "w-0 flex-1 bg-transparent py-3 text-base placeholder:text-fd-muted-foreground focus-visible:outline-none" }), _jsx("button", { type: "button", "aria-label": "Close Search", onClick: () => {
                    setOpenSearch(false);
                }, className: cn(buttonVariants({
                    color: 'outline',
                    className: 'text-xs p-1.5',
                })), children: "Esc" })] }));
}
function SearchList({ items, hideResults = false }) {
    const [active, setActive] = useState();
    const { text } = useI18n();
    const router = useRouter();
    const sidebar = useSidebar();
    const { setOpenSearch } = useSearchContext();
    if (items.length > 0 &&
        (!active || items.every((item) => item.id !== active))) {
        setActive(items[0].id);
    }
    const listenerRef = useRef();
    listenerRef.current = (e) => {
        if (e.key === 'ArrowDown' || e.key == 'ArrowUp') {
            setActive((cur) => {
                const idx = items.findIndex((item) => item.id === cur);
                if (idx === -1)
                    return items.at(0)?.id;
                return items.at((e.key === 'ArrowDown' ? idx + 1 : idx - 1) % items.length)?.id;
            });
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            const selected = items.find((item) => item.id === active);
            if (selected)
                onOpen(selected.url);
            e.preventDefault();
        }
    };
    useEffect(() => {
        const listener = (e) => {
            listenerRef.current?.(e);
        };
        window.addEventListener('keydown', listener);
        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, []);
    const onOpen = (url) => {
        router.push(url);
        setOpenSearch(false);
        sidebar.setOpen(false);
    };
    return (_jsxs("div", { className: cn('flex max-h-[460px] flex-col overflow-y-auto border-t p-2', hideResults && 'hidden'), children: [items.length === 0 ? (_jsx("div", { className: "py-12 text-center text-sm", children: text.searchNoResult })) : null, items.map((item) => (_jsxs(CommandItem, { value: item.id, active: active, onActiveChange: setActive, onClick: () => {
                    onOpen(item.url);
                }, children: [item.type !== 'page' ? (_jsx("div", { role: "none", className: "ms-2 h-full min-h-10 w-px bg-fd-border" })) : null, icons[item.type], _jsx("p", { className: "w-0 flex-1 truncate", children: item.content })] }, item.id)))] }));
}
function LoadingIndicator({ isLoading }) {
    return (_jsxs("div", { className: "relative size-4", children: [_jsx(Loader2, { className: cn('absolute size-full animate-spin text-fd-primary transition-opacity', !isLoading && 'opacity-0') }), _jsx(SearchIcon, { className: cn('absolute size-full text-fd-muted-foreground transition-opacity', isLoading && 'opacity-0') })] }));
}
function CommandItem({ active, onActiveChange, value, ...props }) {
    return (_jsx("button", { ref: useCallback((element) => {
            if (active === value && element) {
                element.scrollIntoView({
                    block: 'nearest',
                });
            }
        }, [active, value]), type: "button", "aria-selected": active === value, onPointerMove: () => onActiveChange(value), ...props, className: cn('flex min-h-10 select-none flex-row items-center gap-2.5 rounded-lg px-2 text-start text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-selected:bg-fd-accent aria-selected:text-fd-accent-foreground', props.className), children: props.children }));
}
