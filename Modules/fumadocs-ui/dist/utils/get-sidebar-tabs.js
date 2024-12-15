export function getSidebarTabs(pageTree, { transform } = {}) {
    const options = [];
    function traverse(node) {
        if (node.type === 'folder' && node.root) {
            const index = node.index ?? node.children.at(0);
            if (index?.type === 'page') {
                const option = {
                    url: index.url,
                    title: node.name,
                    icon: node.icon,
                    folder: node,
                    description: node.description,
                };
                const mapped = transform ? transform(option, node) : option;
                if (mapped)
                    options.push(mapped);
            }
        }
        if (node.type === 'folder')
            node.children.forEach(traverse);
    }
    pageTree.children.forEach(traverse);
    return options;
}
