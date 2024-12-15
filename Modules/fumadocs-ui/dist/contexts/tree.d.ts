import type { PageTree } from 'fumadocs-core/server';
import { type ReactNode } from 'react';
interface TreeContextType {
    root: PageTree.Root | PageTree.Folder;
}
export declare function TreeContextProvider({ children, tree, }: {
    tree: PageTree.Root;
    children: ReactNode;
}): ReactNode;
export declare function useTreePath(): PageTree.Node[];
export declare function useTreeContext(): TreeContextType;
export {};
//# sourceMappingURL=tree.d.ts.map