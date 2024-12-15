import { ReactNode, ReactElement } from 'react';

interface Root {
    name: ReactNode;
    children: Node[];
}
type Node = Item | Separator | Folder;
interface Item {
    type: 'page';
    name: ReactNode;
    url: string;
    external?: boolean;
    icon?: ReactElement;
    $ref?: {
        file: string;
    };
}
interface Separator {
    type: 'separator';
    name: ReactNode;
}
interface Folder {
    $ref?: {
        metaFile?: string;
    };
    type: 'folder';
    name: ReactNode;
    description?: ReactNode;
    root?: boolean;
    defaultOpen?: boolean;
    index?: Item;
    icon?: ReactElement;
    children: Node[];
}

type pageTree_Folder = Folder;
type pageTree_Item = Item;
type pageTree_Node = Node;
type pageTree_Root = Root;
type pageTree_Separator = Separator;
declare namespace pageTree {
  export type { pageTree_Folder as Folder, pageTree_Item as Item, pageTree_Node as Node, pageTree_Root as Root, pageTree_Separator as Separator };
}

export { type Folder as F, type Item as I, type Node as N, type Root as R, type Separator as S, pageTree as p };
