import {
  __async,
  __objRest,
  __spreadProps,
  __spreadValues,
  generate,
  generateDocumentation,
  getProject,
  renderMarkdownToHast
} from "./chunk-2L4CMRDQ.js";

// src/generate/mdx.ts
import * as path from "node:path";
import fs from "node:fs";
var regex = new RegExp("^---type-table---\\r?\\n(?<file>.+?)(?:#(?<name>.+))?\\r?\\n---end---$", "gm");
var defaultTemplates = {
  block: (doc, c) => `### ${doc.name}

${doc.description}

<div className='*:border-b [&>*:last-child]:border-b-0'>${c}</div>`,
  property: (c) => `<div className='text-sm text-fd-muted-foreground py-4'>

<div className="flex flex-row items-center gap-4">
  <code className="text-sm">${c.name}</code>
  <code className="text-fd-muted-foreground">{${JSON.stringify(c.type)}}</code>
</div>

${c.description || "No Description"}

${Object.entries(c.tags).map(([tag, value]) => `- ${tag}:
${replaceJsDocLinks(value)}`).join("\n")}

</div>`
};
function generateMDX(source, _a = {}) {
  var _b = _a, { basePath = "./", templates: overrides } = _b, rest = __objRest(_b, ["basePath", "templates"]);
  var _a2;
  const templates = __spreadValues(__spreadValues({}, defaultTemplates), overrides);
  const project = (_a2 = rest.project) != null ? _a2 : getProject(rest.config);
  return source.replace(regex, (...args) => {
    const groups = args[args.length - 1];
    const file = path.resolve(basePath, groups.file);
    const content = fs.readFileSync(file);
    const docs = generateDocumentation(file, groups.name, content.toString(), __spreadProps(__spreadValues({}, rest), {
      project
    }));
    return docs.map(
      (doc) => templates.block(doc, doc.entries.map(templates.property).join("\n"))
    ).join("\n\n");
  });
}
function replaceJsDocLinks(md) {
  return md.replace(new RegExp("{@link (?<link>[^}]*)}", "g"), "$1");
}

// src/generate/file.ts
import * as path2 from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import fg from "fast-glob";
function generateFiles(options) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    const files = yield fg(options.input, options.globOptions);
    const project = (_c = (_a = options.options) == null ? void 0 : _a.project) != null ? _c : getProject((_b = options.options) == null ? void 0 : _b.config);
    const produce = files.map((file) => __async(this, null, function* () {
      const absolutePath = path2.resolve(file);
      const outputPath = typeof options.output === "function" ? options.output(file) : path2.resolve(
        options.output,
        `${path2.basename(file, path2.extname(file))}.mdx`
      );
      const content = (yield readFile(absolutePath)).toString();
      let result = generateMDX(content, __spreadProps(__spreadValues({
        basePath: path2.dirname(absolutePath)
      }, options.options), {
        project
      }));
      if (options.transformOutput) {
        result = options.transformOutput(outputPath, result);
      }
      yield write(outputPath, result);
      console.log(`Generated: ${outputPath}`);
    }));
    yield Promise.all(produce);
  });
}
function write(file, content) {
  return __async(this, null, function* () {
    yield mkdir(path2.dirname(file), { recursive: true });
    yield writeFile(file, content);
  });
}
export {
  generate,
  generateDocumentation,
  generateFiles,
  generateMDX,
  getProject,
  renderMarkdownToHast
};
