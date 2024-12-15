import type { CSSRuleObject, PresetsConfig } from 'tailwindcss/types/config';
import { presets } from './theme/colors';
import { type Options as TypographyOptions, typography } from './theme/typography';
export interface DocsUIOptions extends Pick<TypographyOptions, 'disableRoundedTable'> {
    /**
     * Prefix to the variable name of colors
     *
     * @defaultValue ''
     */
    cssPrefix?: string;
    /**
     * Add Fumadocs UI `fd-*` colors to global colors
     *
     * @defaultValue false
     */
    addGlobalColors?: boolean;
    /**
     * Change the default styles of `container`
     *
     * @defaultValue true
     */
    modifyContainer?: boolean;
    /**
     * Max width of docs layout
     *
     * @defaultValue '100vw'
     */
    layoutWidth?: string;
    /**
     * Color preset
     */
    preset?: keyof typeof presets | Preset;
    typography?: TypographyOptions;
}
type Keys = 'background' | 'foreground' | 'muted' | 'muted-foreground' | 'popover' | 'popover-foreground' | 'card' | 'card-foreground' | 'border' | 'primary' | 'primary-foreground' | 'secondary' | 'secondary-foreground' | 'accent' | 'accent-foreground' | 'ring';
type Theme = Record<Keys, string>;
export interface Preset {
    light: Theme;
    dark: Theme;
    css?: CSSRuleObject;
}
export declare const docsUi: {
    (options: DocsUIOptions): {
        handler: import("tailwindcss/types/config").PluginCreator;
        config?: Partial<import("tailwindcss/types/config").Config>;
    };
    __isOptionsFunction: true;
};
export declare function createPreset(options?: DocsUIOptions): PresetsConfig;
export { typography };
export { presets } from './theme/colors';
//# sourceMappingURL=tailwind-plugin.d.ts.map