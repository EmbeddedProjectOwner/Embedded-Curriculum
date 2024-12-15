import { jsx as _jsx } from "react/jsx-runtime";
import Link from 'fumadocs-core/link';
import NextImage from 'next/image';
import { Card, Cards } from './components/card';
import { Callout } from './components/callout';
import { Heading } from './components/heading';
import { cn } from './utils/cn';
import { Pre } from './mdx.client';
function Image(props) {
    return (_jsx(NextImage, { sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px", ...props, className: cn('rounded-lg', props.className) }));
}
function Table(props) {
    return (_jsx("div", { className: "relative overflow-auto", children: _jsx("table", { ...props }) }));
}
const defaultMdxComponents = {
    pre: Pre,
    Card,
    Cards,
    a: Link,
    img: Image,
    h1: (props) => (_jsx(Heading, { as: "h1", ...props })),
    h2: (props) => (_jsx(Heading, { as: "h2", ...props })),
    h3: (props) => (_jsx(Heading, { as: "h3", ...props })),
    h4: (props) => (_jsx(Heading, { as: "h4", ...props })),
    h5: (props) => (_jsx(Heading, { as: "h5", ...props })),
    h6: (props) => (_jsx(Heading, { as: "h6", ...props })),
    table: Table,
    Callout,
};
/**
 * **Server Component Only**
 *
 * Sometimes, if you directly pass a client component to MDX Components, it will throw an error
 *
 * To solve this, you can re-create the component in a server component like: `(props) => <Component {...props} />`
 *
 * This function does that for you
 *
 * @param c - MDX Components
 * @returns MDX Components with re-created client components
 * @deprecated no longer used
 */
export function createComponents(c) {
    const mapped = Object.entries(c).map(([k, V]) => {
        // Client components are empty objects
        return [
            k,
            Object.keys(V).length === 0 ? (props) => _jsx(V, { ...props }) : V,
        ];
    });
    return Object.fromEntries(mapped);
}
export { defaultMdxComponents as default };
