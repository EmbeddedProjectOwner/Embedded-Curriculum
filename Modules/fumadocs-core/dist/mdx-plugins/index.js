import {
  resolvePath,
  slash
} from "../chunk-SHGL6VBO.js";
import {
  flattenNode,
  remarkHeading
} from "../chunk-4MNUWZIW.js";
import {
  createStyleTransformer,
  defaultThemes
} from "../chunk-7CSWJQ5H.js";
import "../chunk-MLKGABMK.js";

// src/mdx-plugins/index.ts
import {
  default as default2
} from "remark-gfm";
//"0 0 384 512
// src/mdx-plugins/rehype-code.ts
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";

// ../../node_modules/.pnpm/shiki-transformers@1.0.1_shiki@1.23.1/node_modules/shiki-transformers/dist/index.js
var matchers = [
  [/^(<!--)(.+)(-->)$/, false],
  [/^(\/\*)(.+)(\*\/)$/, false],
  [/^(\/\/|["']|;{1,2}|%{1,2}|--|#)(.+)$/, true],
  /**
   * for multi-line comments like this
   */
  [/^(\*)(.+)$/, true]
];
function parseComments(lines, jsx) {
  const out = [];
  for (const line of lines) {
    const elements = line.children;
    const start = jsx ? elements.length - 2 : elements.length - 1;
    for (let i = Math.max(start, 0); i < elements.length; i++) {
      const token = elements[i];
      if (token.type !== "element")
        continue;
      const isLast = i === elements.length - 1;
      const match = matchToken(token, isLast);
      if (!match) continue;
      if (jsx && !isLast && i !== 0) {
        const left = elements[i - 1];
        const right = elements[i + 1];
        out.push({
          info: match,
          line,
          token,
          isJsxStyle: isValue(left, "{") && isValue(right, "}")
        });
      } else {
        out.push({
          info: match,
          line,
          token,
          isJsxStyle: false
        });
      }
    }
  }
  return out;
}
function isValue(element, value) {
  if (element.type !== "element") return false;
  const text = element.children[0];
  if (text.type !== "text")
    return false;
  return text.value.trim() === value;
}
function matchToken(token, isLast) {
  const text = token.children[0];
  if (text.type !== "text")
    return;
  for (const [matcher, endOfLine] of matchers) {
    if (endOfLine && !isLast) continue;
    let trimmed = text.value.trimStart();
    const spaceFront = text.value.length - trimmed.length;
    trimmed = trimmed.trimEnd();
    const spaceEnd = text.value.length - trimmed.length - spaceFront;
    const result = matcher.exec(trimmed);
    if (!result) continue;
    return [
      " ".repeat(spaceFront) + result[1],
      result[2],
      result[3] ? result[3] + " ".repeat(spaceEnd) : void 0
    ];
  }
}
function createCommentNotationTransformer(name, regex, onMatch) {
  return {
    name,
    code(code) {
      const lines = code.children.filter((i) => i.type === "element");
      const linesToRemove = [];
      code.data ??= {};
      const data = code.data;
      data._shiki_notation ??= parseComments(lines, ["jsx", "tsx"].includes(this.options.lang));
      const parsed = data._shiki_notation;
      for (const comment of parsed) {
        if (comment.info[1].length === 0) continue;
        const isLineCommentOnly = comment.line.children.length === (comment.isJsxStyle ? 3 : 1);
        let lineIdx = lines.indexOf(comment.line);
        if (isLineCommentOnly) lineIdx++;
        comment.info[1] = comment.info[1].replace(regex, (...match) => {
          if (onMatch.call(this, match, comment.line, comment.token, lines, lineIdx)) {
            return "";
          }
          return match[0];
        });
        const isEmpty = comment.info[1].trim().length === 0;
        if (isEmpty) comment.info[1] = "";
        if (isEmpty && isLineCommentOnly) {
          linesToRemove.push(comment.line);
        } else if (isEmpty && comment.isJsxStyle) {
          comment.line.children.splice(comment.line.children.indexOf(comment.token) - 1, 3);
        } else if (isEmpty) {
          comment.line.children.splice(comment.line.children.indexOf(comment.token), 1);
        } else {
          const head = comment.token.children[0];
          if (head.type === "text") {
            head.value = comment.info.join("");
          }
        }
      }
      for (const line of linesToRemove)
        code.children.splice(code.children.indexOf(line), 1);
    }
  };
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function transformerNotationMap(options = {}, name = "@shikijs/transformers:notation-map") {
  const {
    classMap = {},
    classActivePre = void 0
  } = options;
  return createCommentNotationTransformer(
    name,
    new RegExp(`\\s*\\[!code (${Object.keys(classMap).map(escapeRegExp).join("|")})(:\\d+)?\\]`),
    function([_, match, range = ":1"], _line, _comment, lines, index) {
      const lineNum = Number.parseInt(range.slice(1), 10);
      for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {

        this.addClassToHast(lines[i], classMap[match]);
      }
      if (classActivePre)
       
        this.addClassToHast(this.pre, classActivePre);
      return true;
    }
  );
}
function transformerNotationDiff(options = {}) {
  const {
    classLineAdd = "diff add",
    classLineRemove = "diff remove",
    classActivePre = "has-diff"
  } = options;
  return transformerNotationMap(
    {
      classMap: {
        "++": classLineAdd,
        "--": classLineRemove,
        "__": classLineRemove,
      },
      classActivePre
    },
    "@shikijs/transformers:notation-diff"
  );
}
function transformerNotationHighlight(options = {}) {
  const {
    classActiveLine = "highlighted",
    classActivePre = "has-highlighted"
  } = options;
  return transformerNotationMap(
    {
      classMap: {
        highlight: classActiveLine,
        hl: classActiveLine
      },
      classActivePre
    },
    "@shikijs/transformers:notation-highlight"
  );
}
function highlightWordInLine(line, ignoredElement, word, className) {
  const content = getTextContent(line);
  let index = content.indexOf(word);
  while (index !== -1) {
    highlightRange.call(this, line.children, ignoredElement, index, word.length, className);
    index = content.indexOf(word, index + 1);
  }
}
function getTextContent(element) {
  if (element.type === "text")
    return element.value;
  if (element.type === "element" && element.tagName === "span")
    return element.children.map(getTextContent).join("");
  return "";
}
function highlightRange(elements, ignoredElement, index, len, className) {
  let currentIdx = 0;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.type !== "element" || element.tagName !== "span" || element === ignoredElement)
      continue;
    const textNode = element.children[0];
    if (textNode.type !== "text")
      continue;
    if (hasOverlap([currentIdx, currentIdx + textNode.value.length - 1], [index, index + len])) {
      const start = Math.max(0, index - currentIdx);
      const length = len - Math.max(0, currentIdx - index);
      if (length === 0)
        continue;
      const separated = separateToken(element, textNode, start, length);
      this.addClassToHast(separated[1], className);
      const output = separated.filter(Boolean);
      elements.splice(i, 1, ...output);
      i += output.length - 1;
    }
    currentIdx += textNode.value.length;
  }
}
function hasOverlap(range1, range2) {
  return range1[0] <= range2[1] && range1[1] >= range2[0];
}
function separateToken(span, textNode, index, len) {
  const text = textNode.value;
  const createNode = (value) => inheritElement(span, {
    children: [
      {
        type: "text",
        value
      }
    ]
  });
  return [
    index > 0 ? createNode(text.slice(0, index)) : void 0,
    createNode(text.slice(index, index + len)),
    index + len < text.length ? createNode(text.slice(index + len)) : void 0
  ];
}
function inheritElement(original, overrides) {
  return {
    ...original,
    properties: {
      ...original.properties
    },
    ...overrides
  };
}
function transformerNotationWordHighlight(options = {}) {
  const {
    classActiveWord = "highlighted-word",
    classActivePre = void 0
  } = options;
  return createCommentNotationTransformer(
    "@shikijs/transformers:notation-highlight-word",
    /\s*\[!code word:((?:\\.|[^:\]])+)(:\d+)?\]/,
    function([_, word, range], _line, comment, lines, index) {
      const lineNum = range ? Number.parseInt(range.slice(1), 10) : lines.length;
      word = word.replace(/\\(.)/g, "$1");
      for (let i = index; i < Math.min(index + lineNum, lines.length); i++) {
        highlightWordInLine.call(this, lines[i], comment, word, classActiveWord);
      }
      if (classActivePre)
        this.addClassToHast(this.pre, classActivePre);
      return true;
    }
  );
}
var symbol = Symbol("highlighted-lines");

// src/mdx-plugins/rehype-code.ts
import {
  getSingletonHighlighter,
  bundledLanguages
} from "shiki";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// src/mdx-plugins/transformer-icon.ts
var defaultShortcuts = {
  js: "javascript",
  jsx: "react",
  ts: "typescript",
  tsx: "react",
  "c#": "csharp",
  cs: "csharp",
  gql: "graphql",
  py: "python",
  bash: "shellscript",
  sh: "shellscript",
  shell: "shellscript",
  zsh: "shellscript",
  html: "html",
  css: "css",
  "c++": "cpp"
};
var defaultIcons = {
  react: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
  },
  vue: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z"
  },
  ruby: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007.016-.03 9.255 2.956-1.396-5.431-.99-3.9 8.82-.569-.615-.51L16.5 2.114 20.159.073l-.003.01zM0 19.089zM5.13 5.073c3.561-3.533 8.157-5.621 9.922-3.84 1.762 1.777-.105 6.105-3.673 9.636-3.563 3.532-8.103 5.734-9.864 3.957-1.766-1.777.045-6.217 3.612-9.75l.003-.003z"
  },
  zig: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "m23.53 1.02-7.686 3.45h-7.06l-2.98 3.452h7.173L.47 22.98l7.681-3.607h7.065v-.002l2.978-3.45-7.148-.001 12.482-14.9zM0 4.47v14.901h1.883l2.98-3.45H3.451v-8h.942l2.824-3.45H0zm22.117 0-2.98 3.608h1.412v7.844h-.942l-2.98 3.45H24V4.47h-1.883z"
  },
  swift: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z"
  },
  prisma: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z"
  },
  typescript: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
  },
  javascript: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"
  },
  php: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"
  },
  shellscript: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
  },
  c: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M16.5921 9.1962s-.354-3.298-3.627-3.39c-3.2741-.09-4.9552 2.474-4.9552 6.14 0 3.6651 1.858 6.5972 5.0451 6.5972 3.184 0 3.5381-3.665 3.5381-3.665l6.1041.365s.36 3.31-2.196 5.836c-2.552 2.5241-5.6901 2.9371-7.8762 2.9201-2.19-.017-5.2261.034-8.1602-2.97-2.938-3.0101-3.436-5.9302-3.436-8.8002 0-2.8701.556-6.6702 4.047-9.5502C7.444.72 9.849 0 12.254 0c10.0422 0 10.7172 9.2602 10.7172 9.2602z"
  },
  cpp: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"
  },
  go: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z"
  },
  graphql: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M12.002 0a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm8.54 4.931a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm0 9.862a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm-8.54 4.931a2.138 2.138 0 1 0 0 4.276 2.138 2.138 0 1 0 0-4.276zm-8.542-4.93a2.138 2.138 0 1 0 0 4.276 2.138 2.138 0 1 0 0-4.277zm0-9.863a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm8.542-3.378L2.953 6.777v10.448l9.049 5.224 9.047-5.224V6.777zm0 1.601 7.66 13.27H4.34zm-1.387.371L3.97 15.037V7.363zm2.774 0 6.646 3.838v7.674zM5.355 17.44h13.293l-6.646 3.836z"
  },
  python: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
  },
  md: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z"
  },
  kotlin: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M24 24H0V0h24L12 12Z"
  },
  rust: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z"
  },
  html: {
    viewBox: "0 0 384 512",
    fill: "currentColor",
    d: "M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z",
  },
  css: { 
    viewBox: "0 0 512 512",
    fill: "currentColor",
    d: "m64 32 35 403.22L255.77 480 413 435.15 448 32zm290.68 334.9L256.07 395l-98.46-28.24-6.75-77.76h48.26l3.43 39.56 53.59 15.16.13.28 53.47-14.85 5.64-64.15H203l-4-50h120.65l4.35-51H140l-4-49h240.58z"
  },
  csharp: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M1.194 7.543v8.913c0 1.103.588 2.122 1.544 2.674l7.718 4.456a3.086 3.086 0 0 0 3.088 0l7.718-4.456a3.087 3.087 0 0 0 1.544-2.674V7.543a3.084 3.084 0 0 0-1.544-2.673L13.544.414a3.086 3.086 0 0 0-3.088 0L2.738 4.87a3.085 3.085 0 0 0-1.544 2.673Zm5.403 2.914v3.087a.77.77 0 0 0 .772.772.773.773 0 0 0 .772-.772.773.773 0 0 1 1.317-.546.775.775 0 0 1 .226.546 2.314 2.314 0 1 1-4.631 0v-3.087c0-.615.244-1.203.679-1.637a2.312 2.312 0 0 1 3.274 0c.434.434.678 1.023.678 1.637a.769.769 0 0 1-.226.545.767.767 0 0 1-1.091 0 .77.77 0 0 1-.226-.545.77.77 0 0 0-.772-.772.771.771 0 0 0-.772.772Zm12.35 3.087a.77.77 0 0 1-.772.772h-.772v.772a.773.773 0 0 1-1.544 0v-.772h-1.544v.772a.773.773 0 0 1-1.317.546.775.775 0 0 1-.226-.546v-.772H12a.771.771 0 1 1 0-1.544h.772v-1.543H12a.77.77 0 1 1 0-1.544h.772v-.772a.773.773 0 0 1 1.317-.546.775.775 0 0 1 .226.546v.772h1.544v-.772a.773.773 0 0 1 1.544 0v.772h.772a.772.772 0 0 1 0 1.544h-.772v1.543h.772a.776.776 0 0 1 .772.772Zm-3.088-2.315h-1.544v1.543h1.544v-1.543Z"
  },
  default: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    d: "M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z"
  }
};
function transformerIcon(options = {}) {
  const shortcuts = {
    ...defaultShortcuts,
    ...options.shortcuts
  };
  const icons = {
    ...defaultIcons,
    ...options.extend
  };
  const defaultIcon = "default" in icons ? icons.default : void 0;
  return {
    name: "rehype-code:icon",
    pre(pre) {
      const lang = this.options.lang;
      if (!lang) return;
      const iconName = lang in shortcuts ? shortcuts[lang] : lang;
      const icon = iconName in icons ? icons[iconName] : defaultIcon;
      
      if (icon) {
        pre.properties.langtype = lang

        pre.properties.icon = `<svg viewBox="${icon.viewBox}"><path d="${icon.d}" fill="${icon.fill}" /></svg>`;
      }
      return pre;
    }
  };
}

// src/mdx-plugins/rehype-code.ts
var metaValues = [
  {
    name: "title",
    regex: /title="(?<value>[^"]*)"/
  },
  {
    name: "custom",
    regex: /custom="(?<value>[^"]+)"/
  },
  {
    name: "tab",
    regex: /tab="(?<value>[^"]+)"/
  }
];
var rehypeCodeDefaultOptions = {
  themes: defaultThemes,
  defaultColor: false,
  defaultLanguage: "plaintext",
  experimentalJSEngine: false,
  transformers: [
    createStyleTransformer(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerNotationDiff()
  ],
  parseMetaString(meta) {
    const map = {};
    for (const value of metaValues) {
      const result = value.regex.exec(meta);
      if (result) {
        map[value.name] = result[1];
      }
    }
    return map;
  },
  filterMetaString(meta) {
    let replaced = meta;
    for (const value of metaValues) {
      replaced = replaced.replace(value.regex, "");
    }
    return replaced;
  }
};
function rehypeCode(options = {}) {
  const codeOptions = {
    ...rehypeCodeDefaultOptions,
    ...options
  };
  codeOptions.transformers ||= [];
  codeOptions.transformers = [
    {
      name: "rehype-code:pre-process",
      preprocess(code, { meta }) {
        if (meta && codeOptions.filterMetaString) {
          meta.__raw = codeOptions.filterMetaString(meta.__raw ?? "");
        }
        return code.replace(/\n$/, "");
      }
    },
    ...codeOptions.transformers
  ];
  if (codeOptions.icon !== false) {
    codeOptions.transformers = [
      ...codeOptions.transformers,
      transformerIcon(codeOptions.icon)
    ];
  }
  if (codeOptions.tab !== false) {
    codeOptions.transformers = [...codeOptions.transformers, transformerTab()];
  }
  
  let themeItems = [];
  if ("themes" in codeOptions) {
    themeItems = Object.values(codeOptions.themes);
  } else if ("theme" in codeOptions) {
    themeItems = [codeOptions.theme];
  }
  const highlighter = getSingletonHighlighter({
    engine: codeOptions.experimentalJSEngine ? createJavaScriptRegexEngine() : createOnigurumaEngine(() => import("shiki/wasm")),
    themes: themeItems.filter(Boolean),
    langs: codeOptions.langs ?? Object.keys(bundledLanguages)
  });
  
  const transformer = highlighter.then(
    (instance) => rehypeShikiFromHighlighter(instance, codeOptions)
  );
  
  return async (tree, file) => {
    await (await transformer)(tree, file, () => {
    });
  };
}
function transformerTab() {
  return {
    name: "rehype-code:tab",
    // @ts-expect-error -- types not compatible with MDX
    root(root) {
      const meta = this.options.meta;
      if (typeof meta?.tab !== "string") return root;
      return {
        type: "root",
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "Tab",
            data: {
              _codeblock: true
            },
            attributes: [
              { type: "mdxJsxAttribute", name: "value", value: meta.tab }
            ],
            children: root.children
          }
        ]
      };
    }
  };
}

// src/mdx-plugins/remark-image.ts
import path from "node:path";
import { visit } from "unist-util-visit";
import sizeOf from "image-size";
var VALID_BLUR_EXT = [".jpeg", ".png", ".webp", ".avif", ".jpg"];
var EXTERNAL_URL_REGEX = /^https?:\/\//;
function remarkImage({
  placeholder = "blur",
  external = true,
  useImport = true,
  publicDir = path.join(process.cwd(), "public")
} = {}) {
  return async (tree, file) => {
    const importsToInject = [];
    const promises = [];
    function getImportPath(src) {
      if (!src.startsWith("/")) return src;
      const to = path.join(publicDir, src);
      if (file.dirname) {
        const relative = slash(path.relative(file.dirname, to));
        return relative.startsWith("./") ? relative : `./${relative}`;
      }
      return slash(to);
    }
    visit(tree, "image", (node) => {
      const url = decodeURI(node.url);
      if (!url) return;
      const isExternal = EXTERNAL_URL_REGEX.test(url);
      if (isExternal && external || !useImport) {
        const task = getImageSize(url, publicDir).then((size) => {
          if (!size.width || !size.height) return;
          Object.assign(node, {
            type: "mdxJsxFlowElement",
            name: "img",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "alt",
                value: node.alt ?? "image"
              },
              {
                type: "mdxJsxAttribute",
                name: "src",
                value: url
              },
              {
                type: "mdxJsxAttribute",
                name: "width",
                value: size.width.toString()
              },
              {
                type: "mdxJsxAttribute",
                name: "height",
                value: size.height.toString()
              }
            ]
          });
        }).catch(() => {
          console.error(
            `[Remark Image] Failed obtain image size for ${url} with public directory ${publicDir}`
          );
        });
        promises.push(task);
      } else if (!isExternal) {
        const variableName = `__img${importsToInject.length.toString()}`;
        const hasBlur = placeholder === "blur" && VALID_BLUR_EXT.some((ext) => url.endsWith(ext));
        importsToInject.push({
          variableName,
          importPath: getImportPath(url)
        });
        Object.assign(node, {
          type: "mdxJsxFlowElement",
          name: "img",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "alt",
              value: node.alt ?? "image"
            },
            hasBlur && {
              type: "mdxJsxAttribute",
              name: "placeholder",
              value: "blur"
            },
            {
              type: "mdxJsxAttribute",
              name: "src",
              value: {
                type: "mdxJsxAttributeValueExpression",
                value: variableName,
                data: {
                  estree: {
                    body: [
                      {
                        type: "ExpressionStatement",
                        expression: { type: "Identifier", name: variableName }
                      }
                    ]
                  }
                }
              }
            }
          ].filter(Boolean)
        });
      }
    });
    await Promise.all(promises);
    if (importsToInject.length > 0) {
      const imports = importsToInject.map(
        ({ variableName, importPath }) => ({
          type: "mdxjsEsm",
          data: {
            estree: {
              body: [
                {
                  type: "ImportDeclaration",
                  source: { type: "Literal", value: importPath },
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: { type: "Identifier", name: variableName }
                    }
                  ]
                }
              ]
            }
          }
        })
      );
      tree.children.unshift(...imports);
    }
  };
}
async function getImageSize(src, dir) {
  const isRelative = src.startsWith("/") || !path.isAbsolute(src);
  let url;
  if (EXTERNAL_URL_REGEX.test(src)) {
    url = src;
  } else if (EXTERNAL_URL_REGEX.test(dir) && isRelative) {
    const base = new URL(dir);
    base.pathname = resolvePath(base.pathname, src);
    url = base.toString();
  } else {
    return sizeOf(isRelative ? path.join(dir, src) : src);
  }
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  return sizeOf(new Uint8Array(buffer));
}

// src/mdx-plugins/remark-structure.ts
import Slugger from "github-slugger";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit as visit2 } from "unist-util-visit";
var slugger = new Slugger();
function remarkStructure({
  types = ["paragraph", "blockquote", "heading", "tableCell"]
} = {}) {
  return (node, file) => {
    slugger.reset();
    const data = { contents: [], headings: [] };
    let lastHeading = "";
    if (file.data.frontmatter) {
      const frontmatter = file.data.frontmatter;
      if (frontmatter._openapi?.structuredData) {
        data.headings.push(...frontmatter._openapi.structuredData.headings);
        data.contents.push(...frontmatter._openapi.structuredData.contents);
      }
    }
    visit2(node, types, (element) => {
      if (element.type === "root") return;
      const content = flattenNode(element).trim();
      if (element.type === "heading") {
        element.data ||= {};
        element.data.hProperties ||= {};
        const properties = element.data.hProperties;
        const id = properties.id ?? slugger.slug(content);
        data.headings.push({
          id,
          content
        });
        lastHeading = id;
        return "skip";
      }
      if (content.length > 0) {
        data.contents.push({
          heading: lastHeading,
          content
        });
        return "skip";
      }
    });
    file.data.structuredData = data;
  };
}
function structure(content, remarkPlugins = [], options = {}) {
  const result = remark().use(remarkGfm).use(remarkPlugins).use(remarkStructure, options).processSync(content);
  return result.data.structuredData;
}

// src/mdx-plugins/remark-admonition.ts
import { visit as visit3 } from "unist-util-visit";
function remarkAdmonition(options = {}) {
  const types = options.types ?? ["warn", "info", "error"];
  const tag = options.tag ?? ":::";
  const typeMap = options.typeMap ?? {
    note: "info",
    tip: "info",
    warning: "warn",
    danger: "error"
  };
  function replaceNodes(nodes) {
    if (nodes.length === 0) return nodes;
    let open = -1, end = -1;
    const attributes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type !== "paragraph") continue;
      const text = flattenNode(nodes[i]);
      const start = types.find((type) => text.startsWith(`${tag}${type}`));
      if (start) {
        if (open !== -1) throw new Error("Nested callout is not supported");
        open = i;
        attributes.push({
          type: "mdxJsxAttribute",
          name: "type",
          value: start in typeMap ? typeMap[start] : start
        });
        const rest = text.slice(`${tag}${start}`.length);
        if (rest.startsWith("[") && rest.endsWith("]")) {
          attributes.push({
            type: "mdxJsxAttribute",
            name: "title",
            value: rest.slice(1, -1)
          });
        }
      }
      if (open !== -1 && text === tag) {
        end = i;
        break;
      }
    }
    if (open === -1 || end === -1) return nodes;
    return [
      ...nodes.slice(0, open),
      {
        type: "mdxJsxFlowElement",
        name: "Callout",
        attributes,
        children: nodes.slice(open + 1, end)
      },
      ...replaceNodes(nodes.slice(end + 1))
    ];
  }
  return (tree) => {
    visit3(tree, (node) => {
      if (!("children" in node)) return "skip";
      const result = replaceNodes(node.children);
      if (result === node.children) return;
      node.children = result;
      return "skip";
    });
  };
}

// src/mdx-plugins/rehype-toc.ts
import { toEstree } from "hast-util-to-estree";

// src/mdx-plugins/hast-utils.ts
function visit4(node, tagNames, handler) {
  if (node.type === "element" && tagNames.includes(node.tagName)) {
    const result = handler(node);
    if (result === "skip") return;
  }
  if ("children" in node)
    node.children.forEach((n) => {
      visit4(n, tagNames, handler);
    });
}

// src/mdx-plugins/rehype-toc.ts
function rehypeToc({ exportToc = true } = {}) {
  return (tree) => {
    const output = [];
    visit4(tree, ["h1", "h2", "h3", "h4", "h5", "h6"], (element) => {
      const id = element.properties.id;
      if (!id) return "skip";
      const estree = toEstree(element, {
        elementAttributeNameCase: "react",
        stylePropertyNameCase: "dom"
      });
      if (estree.body[0].type === "ExpressionStatement")
        output.push({
          title: estree.body[0].expression,
          depth: Number(element.tagName.slice(1)),
          url: `#${id}`
        });
      return "skip";
    });
    const declaration = {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: "toc"
          },
          init: {
            type: "ArrayExpression",
            elements: output.map((item) => ({
              type: "ObjectExpression",
              properties: [
                {
                  type: "Property",
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: "Identifier",
                    name: "depth"
                  },
                  value: {
                    type: "Literal",
                    value: item.depth
                  },
                  kind: "init"
                },
                {
                  type: "Property",
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: "Identifier",
                    name: "url"
                  },
                  value: {
                    type: "Literal",
                    value: item.url
                  },
                  kind: "init"
                },
                {
                  type: "Property",
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: "Identifier",
                    name: "title"
                  },
                  value: {
                    type: "JSXFragment",
                    openingFragment: { type: "JSXOpeningFragment" },
                    closingFragment: { type: "JSXClosingFragment" },
                    children: item.title.children
                  },
                  kind: "init"
                }
              ]
            }))
          }
        }
      ]
    };
    tree.children.push({
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          body: [
            exportToc ? {
              type: "ExportNamedDeclaration",
              declaration,
              specifiers: []
            } : declaration
          ],
          sourceType: "module",
          comments: []
        }
      }
    });
  };
}
export {
  rehypeCode,
  rehypeCodeDefaultOptions,
  rehypeToc,
  remarkAdmonition,
  default2 as remarkGfm,
  remarkHeading,
  remarkImage,
  remarkStructure,
  structure,
  transformerIcon,
  transformerTab
};
