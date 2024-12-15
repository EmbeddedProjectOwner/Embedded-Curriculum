import type { PageTree } from 'fumadocs-core/server';
import type { Option } from '../components/layout/root-toggle';
export interface TabOptions {
    transform?: (option: Option, node: PageTree.Folder) => Option | null;
}
export declare function getSidebarTabs(pageTree: PageTree.Root, { transform }?: TabOptions): Option[];
//# sourceMappingURL=get-sidebar-tabs.d.ts.map