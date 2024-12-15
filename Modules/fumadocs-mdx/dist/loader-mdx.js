import {
  getDefaultMDXOptions
} from "./chunk-YA4EPE5U.js";
import {
  getConfigHash,
  getManifestEntryPath,
  loadConfigCached
} from "./chunk-QYUB4AKH.js";

// src/loader-mdx.ts
import path2 from "node:path";
import fs2 from "node:fs/promises";
import { parse } from "node:querystring";
import grayMatter from "gray-matter";

// src/utils/build-mdx.ts
import { createProcessor } from "@mdx-js/mdx";
var cache = /* @__PURE__ */ new Map();
function cacheKey(group, format) {
  return `${group}:${format}`;
}
function buildMDX(group, configHash, source, options = {}) {
  const { filePath, frontmatter, data, ...rest } = options;
  let format = options.format;
  if (!format && filePath) {
    format = filePath.endsWith(".mdx") ? "mdx" : "md";
  }
  format ??= "mdx";
  const key = cacheKey(group, format);
  let cached = cache.get(key);
  if (cached === void 0 || cached.configHash !== configHash) {
    cached = {
      processor: createProcessor({
        outputFormat: "program",
        development: process.env.NODE_ENV === "development",
        ...rest,
        format
      }),
      configHash
    };
    cache.set(key, cached);
  }
  return cached.processor.process({
    value: source,
    path: filePath,
    data: {
      ...data,
      frontmatter
    }
  });
}

// src/utils/format-error.ts
function formatError(file, error) {
  const lines = [];
  function walk(key, { _errors, ...rest }, padStart = 0) {
    if (key !== void 0 || _errors.length > 0) {
      const text = key ? `${key}: ${_errors.join("\n    ")}` : _errors.join("\n");
      lines.push(
        text.split("\n").map((line) => `${" ".repeat(padStart)}${line}`).join("\n")
      );
    }
    for (const [k, v] of Object.entries(rest)) {
      walk(key ? `${key}.${k}` : k, v, padStart + 2);
    }
  }
  walk(void 0, error.format());
  return [`in ${file}:`, ...lines].join("\n");
}

// src/utils/git-timestamp.ts
import path from "node:path";
import fs from "node:fs";
import { spawn } from "cross-spawn";
var cache2 = /* @__PURE__ */ new Map();
function getGitTimestamp(file) {
  const cachedTimestamp = cache2.get(file);
  if (cachedTimestamp) return Promise.resolve(cachedTimestamp);
  return new Promise((resolve, reject) => {
    const cwd = path.dirname(file);
    if (!fs.existsSync(cwd)) {
      resolve(void 0);
      return;
    }
    const fileName = path.basename(file);
    const child = spawn("git", ["log", "-1", '--pretty="%ai"', fileName], {
      cwd
    });
    let output;
    child.stdout.on("data", (d) => output = new Date(String(d)));
    child.on("close", () => {
      if (output) cache2.set(file, output);
      resolve(output);
    });
    child.on("error", reject);
  });
}

// src/loader-mdx.ts
function getQuery(query) {
  let collection;
  let hash;
  const parsed = parse(query.slice(1));
  if (parsed.collection && typeof parsed.collection === "string")
    collection = parsed.collection;
  if (parsed.hash && typeof parsed.hash === "string") hash = parsed.hash;
  return { collection, hash };
}
async function loader(source, callback) {
  this.cacheable(true);
  const context = this.context;
  const filePath = this.resourcePath;
  const { _ctx } = this.getOptions();
  const matter = grayMatter(source);
  const query = getQuery(this.resourceQuery);
  const configHash = query.hash ?? await getConfigHash(_ctx.configPath);
  const config = await loadConfigCached(_ctx.configPath, configHash);
  const collectionId = query.collection;
  let collection = collectionId !== void 0 ? config.collections.get(collectionId) : void 0;
  if (collection && collection.type !== "doc") {
    collection = void 0;
  }
  const mdxOptions = collection?.mdxOptions ?? getDefaultMDXOptions(config.global?.mdxOptions ?? {});
  function getTransformContext() {
    return {
      buildMDX: async (v, options = mdxOptions) => {
        const res = await buildMDX(
          collectionId ?? "global",
          configHash,
          v,
          options
        );
        return String(res.value);
      },
      source,
      path: filePath
    };
  }
  let frontmatter = matter.data;
  if (collection?.schema) {
    const schema = typeof collection.schema === "function" ? collection.schema(getTransformContext()) : collection.schema;
    const result = await schema.safeParseAsync(frontmatter);
    if (result.error) {
      callback(new Error(formatError(filePath, result.error)));
      return;
    }
    frontmatter = result.data;
  }
  const props = matter.data._mdx ?? {};
  if (props.mirror) {
    const mirrorPath = path2.resolve(path2.dirname(filePath), props.mirror);
    this.addDependency(mirrorPath);
    matter.content = await fs2.readFile(mirrorPath).then((res) => grayMatter(res.toString()).content);
  }
  let timestamp;
  if (config.global?.lastModifiedTime === "git")
    timestamp = (await getGitTimestamp(filePath))?.getTime();
  try {
    const file = await buildMDX(
      collectionId ?? "global",
      configHash,
      matter.content,
      {
        development: this.mode === "development",
        ...mdxOptions,
        filePath,
        frontmatter,
        data: {
          lastModified: timestamp
        }
      }
    );
    callback(void 0, String(file.value), file.map ?? void 0);
    if (config.global?.generateManifest) {
      await fs2.mkdir(".next/cache/fumadocs", { recursive: true });
      await fs2.writeFile(
        getManifestEntryPath(filePath),
        JSON.stringify({
          path: filePath,
          data: file.data
        })
      );
    }
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    const fpath = path2.relative(context, filePath);
    error.message = `${fpath}:${error.name}: ${error.message}`;
    callback(error);
  }
}
export {
  loader as default
};
