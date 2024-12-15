export declare const roundedTable: {
    table: {
        borderCollapse: string;
        borderSpacing: string;
        '@apply bg-fd-card rounded-lg border overflow-hidden': string;
    };
    th: {
        textAlign: string;
        '@apply p-2.5 border-s bg-fd-muted': string;
    };
    'th:first-child': {
        '@apply border-s-0': string;
    };
    'th:not(tr:last-child *), td:not(tr:last-child *)': {
        '@apply border-b': string;
    };
    td: {
        textAlign: string;
        '@apply border-s p-2.5': string;
    };
    'td:first-child': {
        '@apply border-s-0': string;
    };
    'tfoot th, tfoot td': {
        borderTopWidth: string;
        borderTopColor: string;
    };
    'thead th, thead td': {
        borderBottomWidth: string;
        borderBottomColor: string;
    };
};
export declare const normalTable: {
    thead: {
        borderBottomWidth: string;
        borderBottomColor: string;
    };
    'thead th': {
        verticalAlign: string;
        paddingInlineEnd: string;
        paddingBottom: string;
        paddingInlineStart: string;
    };
    'thead th:first-child': {
        paddingInlineStart: string;
    };
    'thead th:last-child': {
        paddingInlineEnd: string;
    };
    'tbody td, tfoot td': {
        paddingTop: string;
        paddingInlineEnd: string;
        paddingBottom: string;
        paddingInlineStart: string;
    };
    'tbody td:first-child, tfoot td:first-child': {
        paddingInlineStart: string;
    };
    'tbody td:last-child, tfoot td:last-child': {
        paddingInlineEnd: string;
    };
    'tbody tr': {
        borderBottomWidth: string;
        borderBottomColor: string;
    };
    'tbody tr:last-child': {
        borderBottomWidth: string;
    };
    'tbody td': {
        verticalAlign: string;
    };
    tfoot: {
        borderTopWidth: string;
        borderTopColor: string;
    };
    'tfoot td': {
        verticalAlign: string;
    };
    'th, td': {
        textAlign: string;
    };
};
export interface Config {
    css?: Record<string, string | Record<string, string>>[];
}
export declare const DEFAULT: Config;
//# sourceMappingURL=styles.d.ts.map