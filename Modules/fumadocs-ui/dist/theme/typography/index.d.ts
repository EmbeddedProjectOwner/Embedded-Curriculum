export interface Options {
    className?: string;
    /**
     * Disable custom table styles
     */
    disableRoundedTable?: boolean;
}
export declare const typography: {
    (options: Options): {
        handler: import("tailwindcss/types/config").PluginCreator;
        config?: Partial<import("tailwindcss/types/config").Config>;
    };
    __isOptionsFunction: true;
};
//# sourceMappingURL=index.d.ts.map