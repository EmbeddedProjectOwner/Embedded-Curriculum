'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useI18n, I18nContext, } from './contexts/i18n';
export function I18nProvider({ locales = [], locale, ...props }) {
    const context = useI18n();
    const router = useRouter();
    const segments = usePathname()
        .split('/')
        .filter((v) => v.length > 0);
    const onChange = useCallback((v) => {
        // If locale prefix hidden
        if (segments[0] !== locale) {
            segments.unshift(v);
        }
        else {
            segments[0] = v;
        }
        router.push(`/${segments.join('/')}`);
        router.refresh();
    }, [locale, segments, router]);
    return (_jsx(I18nContext.Provider, { value: {
            locale,
            locales,
            text: {
                ...context.text,
                ...props.translations,
            },
            onChange: props.onChange ?? onChange,
        }, children: props.children }));
}
