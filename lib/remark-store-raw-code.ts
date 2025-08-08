import { visit } from 'unist-util-visit'

export function remarkStoreRawCode() {
  return (tree: any) => {
    visit(tree, 'code', (node) => {
      node.data = node.data || {}
      node.data.rawCode = node.value
    })
  }
}
