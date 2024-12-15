import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, } from 'react';
import * as Primitive from 'fumadocs-core/toc';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
function calc(container, active) {
    if (active.length === 0 || container.clientHeight === 0) {
        return [0, 0];
    }
    let upper = Number.MAX_VALUE, lower = 0;
    for (const item of active) {
        const element = container.querySelector(`a[href="#${item}"]`);
        if (!element)
            continue;
        const styles = getComputedStyle(element);
        upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
        lower = Math.max(lower, element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom));
    }
    return [upper, lower - upper];
}
function update(element, info) {
    element.style.setProperty('--fd-top', `${info[0]}px`);
    element.style.setProperty('--fd-height', `${info[1]}px`);
}
export function TocThumb({ containerRef, ...props }) {
    const active = Primitive.useActiveAnchors();
    const thumbRef = useRef(null);
    const activeRef = useRef(active);
    activeRef.current = active;
    useEffect(() => {
        if (!containerRef.current)
            return;
        const container = containerRef.current;
        const onResize = () => {
            if (!thumbRef.current)
                return;
            update(thumbRef.current, calc(container, activeRef.current));
        };
        onResize();
        const observer = new ResizeObserver(onResize);
        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [containerRef]);
    useOnChange(active, () => {
        if (!containerRef.current || !thumbRef.current)
            return;
        update(thumbRef.current, calc(containerRef.current, active));
    });
    return _jsx("div", { ref: thumbRef, role: "none", ...props });
}
