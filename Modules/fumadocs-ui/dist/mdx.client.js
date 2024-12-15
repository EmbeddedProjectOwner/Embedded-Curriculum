'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as Base from './components/codeblock';
/**
 * You are NOT supposed to use this component directly.
 *
 * This should be referenced in the output generated by the Rehype Code plugin.
 *
 * @internal
 */
export function Pre(props) {
    return (_jsx(Base.CodeBlock, { ...props, children: _jsx(Base.Pre, { children: props.children }) }));
}
