import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, } from 'react';
import { AnchorProvider } from 'fumadocs-core/toc';
import { Card, Cards } from './components/card';
import { replaceOrDefault } from './layouts/shared';
import { cn } from './utils/cn';
import { Footer, LastUpdate, PageContainer, PageHeader, Breadcrumb, } from './page.client';
import { Toc, TOCItems } from './components/layout/toc';
import { TocPopoverTrigger, TocPopover, TocPopoverContent, } from './components/layout/toc-popover';
import { buttonVariants } from './components/ui/button';
import { Edit, Text } from 'lucide-react';
import { I18nLabel } from './contexts/i18n';
import ClerkTOCItems from './components/layout/toc-clerk';
export function DocsPage({ toc = [], breadcrumb = {}, full = false, footer = {}, tableOfContentPopover: { enabled: tocPopoverEnabled = true, component: tocPopoverReplace, ...tocPopoverOptions } = {}, tableOfContent: { 
// disable TOC on full mode, you can still enable it with `enabled` option.
enabled: tocEnabled, component: tocReplace, ...tocOptions } = {}, ...props }) {
    tocEnabled ?? (tocEnabled = !full &&
        (toc.length > 0 ||
            tocOptions.footer !== undefined ||
            tocOptions.header !== undefined));
    const fullWidth = full && !tocEnabled;
    return (_jsxs(AnchorProvider, { toc: toc, single: tocOptions.single, children: [_jsxs(PageContainer, { id: "nd-page", style: {
                    '--fd-toc-width': fullWidth ? '0px' : undefined,
                }, children: [replaceOrDefault({ enabled: tocPopoverEnabled, component: tocPopoverReplace }, _jsx(PageHeader, { id: "nd-tocnav", children: _jsxs(TocPopover, { children: [_jsx(TocPopoverTrigger, { className: "size-full", items: toc }), _jsxs(TocPopoverContent, { children: [tocPopoverOptions.header, tocPopoverOptions.style === 'clerk' ? (_jsx(ClerkTOCItems, { items: toc, isMenu: true })) : (_jsx(TOCItems, { items: toc, isMenu: true })), tocPopoverOptions.footer] })] }) }), {
                        items: toc,
                        ...tocPopoverOptions,
                    }), _jsxs("article", { className: cn('mx-auto flex w-full flex-1 flex-col gap-6 px-4 pt-10 md:px-7 md:pt-12', fullWidth ? 'max-w-[1120px]' : 'max-w-[860px]'), children: [replaceOrDefault(breadcrumb, _jsx(Breadcrumb, { includePage: breadcrumb.full, ...breadcrumb })), props.children, _jsx("div", { role: "none", className: "flex-1" }), _jsxs("div", { className: "flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden", children: [props.editOnGithub ? (_jsx(EditOnGitHub, { ...props.editOnGithub })) : null, props.lastUpdate ? (_jsx(LastUpdate, { date: new Date(props.lastUpdate) })) : null] }), replaceOrDefault(footer, _jsx(Footer, { items: footer.items }))] })] }), replaceOrDefault({ enabled: tocEnabled, component: tocReplace }, _jsx(Toc, { id: "nd-toc", children: _jsxs("div", { className: "flex h-full w-[var(--fd-toc-width)] max-w-full flex-col gap-3 pe-2", children: [tocOptions.header, _jsxs("h3", { className: "-ms-0.5 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground", children: [_jsx(Text, { className: "size-4" }), _jsx(I18nLabel, { label: "toc" })] }), tocOptions.style === 'clerk' ? (_jsx(ClerkTOCItems, { items: toc })) : (_jsx(TOCItems, { items: toc })), tocOptions.footer] }) }), {
                items: toc,
                ...tocOptions,
            }, _jsx("div", { role: "none", className: "flex-1" }))] }));
}
function EditOnGitHub({ owner, repo, sha, path, ...props }) {
    const href = `https://github.com/${owner}/${repo}/blob/${sha}/${path.startsWith('/') ? path.slice(1) : path}`;
    return (_jsxs("a", { href: href, target: "_blank", rel: "noreferrer noopener", ...props, className: cn(buttonVariants({
            color: 'secondary',
            className: 'gap-1.5 py-1 text-fd-muted-foreground',
        }), props.className), children: [_jsx(Edit, { className: "size-3.5" }), _jsx(I18nLabel, { label: "editOnGithub" })] }));
}
/**
 * Add typography styles
 */
export const DocsBody = forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('prose', className), ...props })));
DocsBody.displayName = 'DocsBody';
export const DocsDescription = forwardRef((props, ref) => {
    // don't render if no description provided
    if (props.children === undefined)
        return null;
    return (_jsx("p", { ref: ref, ...props, className: cn('mb-8 text-lg text-fd-muted-foreground', props.className), children: props.children }));
});
DocsDescription.displayName = 'DocsDescription';
export const DocsTitle = forwardRef((props, ref) => {
    return (_jsx("h1", { ref: ref, ...props, className: cn('text-3xl font-bold', props.className), children: props.children }));
});
DocsTitle.displayName = 'DocsTitle';
function findParent(node, page) {
    if ('index' in node && node.index?.$ref?.file === page.file.path) {
        return node;
    }
    for (const child of node.children) {
        if (child.type === 'folder') {
            const parent = findParent(child, page);
            if (parent)
                return parent;
        }
        if (child.type === 'page' && child.$ref?.file === page.file.path) {
            return node;
        }
    }
}
export function DocsCategory({ page, from, tree: forcedTree, ...props }) {
    const tree = forcedTree ??
        (from._i18n
            ? from.pageTree[page.locale ?? from._i18n.defaultLanguage]
            : from.pageTree);
    const parent = findParent(tree, page);
    if (!parent)
        return null;
    const items = parent.children.flatMap((item) => {
        if (item.type !== 'page' || item.url === page.url)
            return [];
        return from.getNodePage(item) ?? [];
    });
    return (_jsx(Cards, { ...props, children: items.map((item) => (_jsx(Card, { title: item.data.title, description: item.data.description ??
                'No Description', href: item.url }, item.url))) }));
}
/**
 * For separate MDX page
 */
export function withArticle({ children }) {
    return (_jsx("main", { className: "container py-12", children: _jsx("article", { className: "prose", children: children }) }));
}
