import * as react from 'react';
import { AnchorHTMLAttributes } from 'react';
import { LinkProps as LinkProps$1 } from 'next/link';

interface LinkProps extends Pick<LinkProps$1, 'prefetch' | 'replace'>, AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * If the href is an external URL
     *
     * automatically determined by default
     */
    external?: boolean;
}
/**
 * Wraps `next/link` and safe to use in MDX documents
 */
declare const Link: react.ForwardRefExoticComponent<LinkProps & react.RefAttributes<HTMLAnchorElement>>;

export { type LinkProps, Link as default };
