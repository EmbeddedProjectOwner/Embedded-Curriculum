'use client';
import { useState, useRef, useEffect, useCallback, } from 'react';
export function useCopyButton(onCopy) {
    const [checked, setChecked] = useState(false);
    const timeoutRef = useRef(null);
    const callbackRef = useRef(onCopy);
    callbackRef.current = onCopy;
    const onClick = useCallback(() => {
        if (timeoutRef.current)
            window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setChecked(false);
        }, 1500);
        callbackRef.current();
        setChecked(true);
    }, []);
    // Avoid updates after being unmounted
    useEffect(() => {
        return () => {
            if (timeoutRef.current)
                window.clearTimeout(timeoutRef.current);
        };
    }, []);
    return [checked, onClick];
}
