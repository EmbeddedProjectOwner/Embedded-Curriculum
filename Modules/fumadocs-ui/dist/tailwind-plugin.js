import plugin from 'tailwindcss/plugin';
import { presets } from './theme/colors';
import { animations } from './theme/animations';
import { typography, } from './theme/typography';
function getThemeStyles(prefix, theme) {
    return Object.fromEntries(Object.entries(theme).map(([k, v]) => [variableName(prefix, k), v]));
}
function variableName(prefix, name) {
    return `--${[prefix, name].filter(Boolean).join('-')}`;
}
function createTailwindColors(prefix, cloneToGlobal) {
    function colorToCSS(name) {
        return `hsl(var(${variableName(prefix, name)}) / <alpha-value>)`;
    }
    const v = new Map();
    for (const key of ['background', 'foreground', 'ring', 'border']) {
        const value = colorToCSS(key);
        v.set(`fd-${key}`, value);
        if (cloneToGlobal)
            v.set(key, value);
    }
    for (const key of [
        'popover',
        'primary',
        'secondary',
        'accent',
        'muted',
        'card',
    ]) {
        const value = {
            DEFAULT: colorToCSS(key),
            foreground: colorToCSS(`${key}-foreground`),
        };
        v.set(`fd-${key}`, value);
        if (cloneToGlobal)
            v.set(key, value);
    }
    return Object.fromEntries(v.entries());
}
export const docsUi = plugin.withOptions(({ cssPrefix = '', preset = 'default', layoutWidth = '100vw' } = {}) => {
    return ({ addBase, addComponents, addUtilities }) => {
        const { light, dark, css } = typeof preset === 'string' ? presets[preset] : preset;
        addBase({
            ':root': {
                ...getThemeStyles(cssPrefix, light),
                '--fd-sidebar-width': '0px',
                '--fd-toc-width': '0px',
                '--fd-layout-width': layoutWidth,
                '--fd-banner-height': '0px',
                '--fd-nav-height': '0px',
                '--fd-diff-remove-color': 'rgba(200,10,100,0.12)',
                '--fd-diff-remove-symbol-color': 'rgb(230,10,100)',
                '--fd-diff-add-color': 'rgba(14,180,100,0.12)',
                '--fd-diff-add-symbol-color': 'rgb(10,200,100)',
            },
            '.dark': getThemeStyles(cssPrefix, dark),
            '*': {
                'border-color': `theme('colors.fd-border')`,
            },
            body: {
                'background-color': `theme('colors.fd-background')`,
                color: `theme('colors.fd-foreground')`,
            },
        });
        if (css)
            addComponents(css);
        // Shiki styles
        addBase({
            '.shiki code span': {
                color: 'var(--shiki-light)',
            },
            '.dark .shiki code span': {
                color: 'var(--shiki-dark)',
            },
            '.fd-codeblock code': {
                display: 'grid',
                'font-size': '13px',
            },
            '.shiki code .diff.remove': {
                backgroundColor: 'var(--fd-diff-remove-color)',
                opacity: '0.7',
            },
            '.shiki code .diff::before': {
                position: 'absolute',
                left: '6px',
            },
            '.shiki code .diff.remove::before': {
                content: "'-'",
                color: 'var(--fd-diff-remove-symbol-color)',
            },
            '.shiki code .diff.add': {
                backgroundColor: 'var(--fd-diff-add-color)',
            },
            '.shiki code .diff.add::before': {
                content: "'+'",
                color: 'var(--fd-diff-add-symbol-color)',
            },
            '.shiki code .diff': {
                margin: '0 -16px',
                padding: '0 16px',
                position: 'relative',
            },
            '.shiki .highlighted': {
                margin: '0 -16px',
                padding: '0 16px',
                backgroundColor: `theme('colors.fd-primary.DEFAULT / 10%')`,
            },
            '.shiki .highlighted-word': {
                padding: '1px 2px',
                margin: '-1px -3px',
                border: '1px solid',
                borderColor: `theme('colors.fd-primary.DEFAULT / 50%')`,
                backgroundColor: `theme('colors.fd-primary.DEFAULT / 10%')`,
                borderRadius: '2px',
            },
        });
        addUtilities({
            '.steps': {
                'counter-reset': 'step',
                'border-left-width': '1px',
                'margin-left': '1rem',
                'padding-left': '1.75rem',
                position: 'relative',
            },
            '.step:before': {
                'background-color': `theme('colors.fd-secondary.DEFAULT')`,
                color: `theme('colors.fd-secondary.foreground')`,
                content: 'counter(step)',
                'counter-increment': 'step',
                'border-radius': `theme('borderRadius.full')`,
                'justify-content': 'center',
                'align-items': 'center',
                width: '2rem',
                height: '2rem',
                'font-size': '.875rem',
                'line-height': '1.25rem',
                display: 'flex',
                position: 'absolute',
                left: '-1rem',
            },
            '.prose-no-margin': {
                '& > :first-child': {
                    marginTop: '0',
                },
                '& > :last-child': {
                    marginBottom: '0',
                },
            },
        });
    };
}, ({ cssPrefix = '', modifyContainer = true, addGlobalColors = false, } = {}) => ({
    theme: {
        extend: {
            // Allow devs to use `container` to match with home layout
            container: modifyContainer
                ? {
                    center: true,
                    padding: '1rem',
                    screens: {
                        '2xl': '1400px',
                    },
                }
                : undefined,
            maxWidth: {
                'fd-container': '1400px',
            },
            spacing: {
                'fd-layout-top': 'calc(var(--fd-banner-height) + var(--fd-nav-height))',
            },
            colors: createTailwindColors(cssPrefix, addGlobalColors),
            ...animations,
        },
    },
}));
export function createPreset(options = {}) {
    return {
        darkMode: 'class',
        plugins: [
            typography({
                disableRoundedTable: options.disableRoundedTable,
                ...options.typography,
            }),
            docsUi(options),
        ],
    };
}
export { typography };
export { presets } from './theme/colors';