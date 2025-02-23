/**
 * Retrieves all tabbable nodes within a given container.
 * @param container - The HTML element to search within.
 * @returns An array of tabbable HTML elements.
*/
export function getTabbableNodes(container: HTMLElement): HTMLElement[] {
    const nodes: HTMLElement[] = [];
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node) =>
                (node as HTMLElement).tabIndex >= 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP
        }
    );

    while (walker.nextNode()) {
        nodes.push(walker.currentNode as HTMLElement);
    }

    return nodes;
}