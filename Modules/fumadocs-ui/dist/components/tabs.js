'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useCallback, createContext, useContext, useRef, useLayoutEffect, } from 'react';
import { cn } from '../utils/cn';
import * as Primitive from './ui/tabs';
export { Primitive };
const listeners = new Map();
function addChangeListener(id, listener) {
    const list = listeners.get(id) ?? [];
    list.push(listener);
    listeners.set(id, list);
}
function removeChangeListener(id, listener) {
    const list = listeners.get(id) ?? [];
    listeners.set(id, list.filter((item) => item !== listener));
}
const ValueToMapContext = createContext(undefined);
export function Tabs({ groupId, items = [], persist = false, defaultIndex = 0, updateAnchor = false, ...props }) {
    const values = useMemo(() => items.map((item) => toValue(item)), [items]);
    const [value, setValue] = useState(values[defaultIndex]);
    const valueToIdMapRef = useRef(new Map());
    const onChangeRef = useRef();
    onChangeRef.current = (v) => {
        if (values.includes(v))
            setValue(v);
    };
    useLayoutEffect(() => {
        if (!groupId)
            return;
        const onUpdate = (v) => onChangeRef.current?.(v);
        const previous = persist
            ? localStorage.getItem(groupId)
            : sessionStorage.getItem(groupId);
        if (previous)
            onUpdate(previous);
        addChangeListener(groupId, onUpdate);
        return () => {
            removeChangeListener(groupId, onUpdate);
        };
    }, [groupId, persist]);
    useLayoutEffect(() => {
        const hash = window.location.hash.slice(1);
        if (!hash)
            return;
        const entry = Array.from(valueToIdMapRef.current.entries()).find(([_, id]) => id === hash);
        if (entry)
            setValue(entry[0]);
    }, []);
    const onValueChange = useCallback((v) => {
        if (updateAnchor) {
            const id = valueToIdMapRef.current.get(v);
            if (id) {
                window.history.replaceState(null, '', `#${id}`);
            }
        }
        if (groupId) {
            listeners.get(groupId)?.forEach((item) => {
                item(v);
            });
            if (persist)
                localStorage.setItem(groupId, v);
            else
                sessionStorage.setItem(groupId, v);
        }
        else {
            setValue(v);
        }
    }, [groupId, persist, updateAnchor]);
    return (_jsxs(Primitive.Tabs, { value: value, onValueChange: onValueChange, ...props, className: cn('my-4', props.className), children: [_jsx(Primitive.TabsList, { children: values.map((v, i) => (_jsx(Primitive.TabsTrigger, { value: v, children: items[i] }, v))) }), _jsx(ValueToMapContext.Provider, { value: valueToIdMapRef.current, children: props.children })] }));
}
function toValue(v) {
    return v.toLowerCase().replace(/\s/, '-');
}
export function Tab({ value, className, ...props }) {
    const v = toValue(value);
    const valueToIdMap = useContext(ValueToMapContext);
    if (props.id) {
        valueToIdMap?.set(v, props.id);
    }
    return (_jsx(Primitive.TabsContent, { value: v, className: cn('prose-no-margin [&>figure:only-child]:-m-4 [&>figure:only-child]:rounded-none [&>figure:only-child]:border-none', className), ...props }));
}
