import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
const itemVariants = cva('rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors', {
    variants: {
        active: {
            true: 'bg-fd-accent text-fd-accent-foreground',
        },
    },
});
export function TagsList({ tag, onTagChange, items, allowClear, ...props }) {
    return (_jsxs("div", { ...props, className: cn('flex flex-row items-center gap-1', props.className), children: [items.map((item) => (_jsx("button", { type: "button", "data-active": tag === item.value, className: cn(itemVariants({ active: tag === item.value }), item.props?.className), onClick: () => {
                    if (tag === item.value && allowClear) {
                        onTagChange(undefined);
                    }
                    else {
                        onTagChange(item.value);
                    }
                }, tabIndex: -1, ...item.props, children: item.name }, item.value))), props.children] }));
}
