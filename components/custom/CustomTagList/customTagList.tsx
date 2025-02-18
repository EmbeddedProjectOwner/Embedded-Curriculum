import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from '@/components/shadcn';
import { Check } from 'lucide-react';

const itemVariants = cva(
    'rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors',
    {
        variants: {
            active: {
                true: 'bg-fd-accent text-fd-accent-foreground',
            },
        },
    }
);

interface TagItem {
    name: string;
    value: string | undefined;
    props?: React.HTMLAttributes<HTMLButtonElement>;
    subTags?: TagItem[]
}

interface TagsListProps extends React.HTMLAttributes<HTMLDivElement> {
    tag?: string;
    onTagChange: (tag: string | undefined) => void;
    allowClear?: boolean;
    items: TagItem[];
}


export function TagsList({
    tag,
    onTagChange,
    items,
    allowClear,
    ...props
}: TagsListProps): JSX.Element {

    const [PopupTrigger, setPopupTrigger] = React.useState<boolean>(false)
    const [PopupTag, setPopupTag] = React.useState<string | null>(null)
    const [Value, setValue] = React.useState<string>("")

console.log(tag)
    return (
        <div {...props} className={cn('flex flex-row items-center gap-1', props.className)}>
            {items.map((item) => {

                if (item.subTags) {
                    return (
                        <Popover key={item.value}>
                            <PopoverTrigger asChild>

                                <button
                                    key={item.value}
                                    type="button"
                                    data-active={tag === item.value}
                                    className={cn(itemVariants({ active: (tag === item.value || (tag?.includes("__|__") && tag?.includes(item.value as string)))}), item.props?.className)}
                                    onClick={() => {
                                        if (tag === item.value && allowClear) {
                                            onTagChange(undefined); // Clear the tag if it's already selected
                                            setPopupTrigger(false)
                                            setValue("")
                                        }
                                    }}
                                    tabIndex={-1}
                                    {...item.props}
                                >
                                   {tag?.includes("__|__") ? `${item.name} | ${tag?.split("__|__")[1]}` : item.name}
                                </button>

                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No sub category found.</CommandEmpty>
                                        <CommandGroup>

                                            <CommandItem
                                                key={item.value}
                                                value={item.value}
                                                onSelect={(currentVal) => {
                                                    setValue(currentVal === Value ? "" : currentVal)
                                                    setPopupTrigger(false)
                                                    onTagChange(item.value)
                                                }}
                                                defaultChecked>Entire {item.name}
                                                <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            Value == item.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    </CommandItem>
                                            {item.subTags.map((val) => (
                                                <CommandItem
                                                    key={val.name}
                                                    value={val.value}
                                                    onSelect={(currentVal) => {
                                                        console.log("selected", Value)
                                                        setValue(currentVal === Value ? "" : currentVal)
                                                        setPopupTrigger(false)
                                                        onTagChange(`${item.value}__|__${val.value}`)
                                                    }}
                                                >{val.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            Value == val.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            Value == item.value ? "visible" : "hidden"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    )
                } else {
                    return (<button
                        key={item.value}
                        type="button"
                        data-active={tag === item.value}
                        className={cn(itemVariants({ active: tag === item.value }), item.props?.className)}
                        onClick={() => {
                            if (tag === item.value && allowClear) {
                                onTagChange(undefined); // Clear the tag if it's already selected
                            } else {
                                onTagChange(item.value); // Set the tag to the selected value
                            }
                        }}
                        tabIndex={-1}
                        {...item.props}
                    >
                        {item.name}
                    </button>
                    )
                }
            })}
            {props.children}
        </div>
    );
}
