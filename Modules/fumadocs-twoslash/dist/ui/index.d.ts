import * as react from 'react';
import * as _radix_ui_react_popover from '@radix-ui/react-popover';

declare function Popup({ delay, children, }: {
    delay?: number;
    children: React.ReactNode;
}): JSX.Element;
declare const PopupTrigger: react.ForwardRefExoticComponent<Omit<_radix_ui_react_popover.PopoverTriggerProps & react.RefAttributes<HTMLButtonElement>, "ref"> & react.RefAttributes<HTMLButtonElement>>;
declare const PopupContent: react.ForwardRefExoticComponent<Omit<Omit<_radix_ui_react_popover.PopoverContentProps & react.RefAttributes<HTMLDivElement>, "ref"> & react.RefAttributes<HTMLDivElement>, "ref"> & react.RefAttributes<HTMLDivElement>>;

export { Popup, PopupContent, PopupTrigger };
