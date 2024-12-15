var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/get-project.ts
import { Project } from "ts-morph";
function getProject(options = {}) {
  var _a;
  return new Project({
    tsConfigFilePath: (_a = options.tsconfigPath) != null ? _a : "./tsconfig.json",
    skipAddingFilesFromTsConfig: true
  });
}

// src/generate/base.ts
import {
  ts
} from "ts-morph";
function generateDocumentation(file, name, content, options = {}) {
  var _a;
  const project = (_a = options.project) != null ? _a : getProject(options.config);
  const sourceFile = project.createSourceFile(file, content, {
    overwrite: true
  });
  const out = [];
  for (const [k, d] of sourceFile.getExportedDeclarations()) {
    if (name && name !== k) continue;
    if (d.length > 1)
      console.warn(
        `export ${k} should not have more than one type declaration.`
      );
    out.push(generate(project, k, d[0], options));
  }
  return out;
}
function generate(program, name, declaration, { allowInternal = false, transform }) {
  var _a;
  const entryContext = {
    transform,
    program,
    type: declaration.getType(),
    declaration
  };
  const comment = (_a = declaration.getSymbol()) == null ? void 0 : _a.compilerSymbol.getDocumentationComment(
    program.getTypeChecker().compilerObject
  );
  return {
    name,
    description: comment ? ts.displayPartsToString(comment) : "",
    entries: declaration.getType().getProperties().map((prop) => getDocEntry(prop, entryContext)).filter(
      (entry) => entry && (allowInternal || !("internal" in entry.tags))
    )
  };
}
function getDocEntry(prop, context) {
  var _a, _b, _c, _d;
  const { transform, program } = context;
  if (context.type.isClass() && prop.getName().startsWith("#")) {
    return;
  }
  const subType = program.getTypeChecker().getTypeOfSymbolAtLocation(prop, context.declaration);
  const tags = Object.fromEntries(
    prop.getJsDocTags().map((tag) => [tag.getName(), ts.displayPartsToString(tag.getText())])
  );
  let typeName = subType.getNonNullableType().getText(void 0, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
  if (subType.getAliasSymbol() && subType.getAliasTypeArguments().length === 0) {
    typeName = (_b = (_a = subType.getAliasSymbol()) == null ? void 0 : _a.getEscapedName()) != null ? _b : typeName;
  }
  if ("remarks" in tags) {
    typeName = (_d = (_c = new RegExp("^`(?<name>.+)`").exec(tags.remarks)) == null ? void 0 : _c[1]) != null ? _d : typeName;
  }
  const entry = {
    name: prop.getName(),
    description: ts.displayPartsToString(
      prop.compilerSymbol.getDocumentationComment(
        program.getTypeChecker().compilerObject
      )
    ),
    tags,
    type: typeName
  };
  transform == null ? void 0 : transform.call(context, entry, subType, prop);
  return entry;
}

// src/markdown.ts
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { getSingletonHighlighter } from "shiki";
function renderMarkdownToHast(md) {
  return __async(this, null, function* () {
    const mdast = fromMarkdown(
      md.replace(new RegExp("{@link (?<link>[^}]*)}", "g"), "$1"),
      // replace jsdoc links
      { mdastExtensions: [gfmFromMarkdown()] }
    );
    const highlighter = yield getSingletonHighlighter({
      themes: ["vitesse-light", "vitesse-dark"]
    });
    function preload(contents) {
      return __async(this, null, function* () {
        yield Promise.all(
          contents.map((c) => __async(this, null, function* () {
            if ("children" in c) yield preload(c.children);
            if (c.type === "code" && c.lang) {
              yield highlighter.loadLanguage(
                c.lang
              );
            }
          }))
        );
      });
    }
    yield preload(mdast.children);
    return toHast(mdast, {
      handlers: {
        // @ts-expect-error hast with mdx
        code(_, node) {
          var _a;
          const lang = (_a = node.lang) != null ? _a : "plaintext";
          return highlighter.codeToHast(node.value, {
            lang,
            themes: {
              light: "vitesse-light",
              dark: "vitesse-dark"
            },
            defaultColor: false,
            transformers: [
              {
                name: "rehype-code:pre-process",
                line(hast) {
                  if (hast.children.length > 0) return;
                  hast.children.push({
                    type: "text",
                    value: " "
                  });
                }
              }
            ]
          }).children;
        }
      }
    });
  });
}

export {
  __spreadValues,
  __spreadProps,
  __objRest,
  __async,
  getProject,
  generateDocumentation,
  generate,
  renderMarkdownToHast
};
