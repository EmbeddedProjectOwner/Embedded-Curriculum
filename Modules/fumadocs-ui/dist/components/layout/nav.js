'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import Link from 'fumadocs-core/link';
import { createContext, useContext, useEffect, useState, } from 'react';
import { cn } from '../../utils/cn';
import { useI18n } from '../../contexts/i18n';
const NavContext = createContext({
    isTransparent: false,
});
export function NavProvider({ transparentMode = 'none', children, }) {
    const [transparent, setTransparent] = useState(transparentMode !== 'none');
    useEffect(() => {
        if (transparentMode !== 'top')
            return;
        const listener = () => {
            setTransparent(window.scrollY < 10);
        };
        listener();
        window.addEventListener('scroll', listener);
        return () => {
            window.removeEventListener('scroll', listener);
        };
    }, [transparentMode]);
    return (_jsx(NavContext.Provider, { value: { isTransparent: transparent }, children: children }));
}
export function useNav() {
    return useContext(NavContext);
}
export function Title({ title, url, ...props }) {
    const { locale } = useI18n();
    return (_jsx(Link, { href: url ?? (locale ? `/${locale}` : '/'), ...props, className: cn('inline-flex items-center gap-2.5 font-semibold', props.className), children: title }));
}
