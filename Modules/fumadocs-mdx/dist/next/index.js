import {
  findConfigFile,
  getConfigHash,
  getTypeFromPath,
  loadConfig,
  loadConfigCached,
  writeManifest
} from "../chunk-QYUB4AKH.js";

// src/next/create.ts
import path3 from "node:path";

// src/map/index.ts
import path2 from "node:path";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import grayMatter from "gray-matter";

// src/map/generate.ts
import * as path from "node:path";
import fg from "fast-glob";
async function generateJS(configPath, config, outputPath, hash, getFrontmatter) {
  const outDir2 = path.dirname(outputPath);
  const imports = [
    {
      type: "named",
      names: ["toRuntime", "toRuntimeAsync"],
      specifier: "fumadocs-mdx"
    }
  ];
  const importedCollections = /* @__PURE__ */ new Set();
  config._runtime.files.clear();
  const entries = Array.from(config.collections.entries());
  const declares = entries.map(async ([k, collection]) => {
    const files = await getCollectionFiles(collection);
    const items = files.map(async (file, i) => {
      config._runtime.files.set(file.absolutePath, k);
      if (collection.type === "doc" && collection.async) {
        const importPath = `${toImportPath(file.absolutePath, outDir2)}?hash=${hash}&collection=${k}`;
        const frontmatter = await getFrontmatter(file.absolutePath);
        return `toRuntimeAsync(${JSON.stringify(frontmatter)}, () => import(${JSON.stringify(importPath)}), ${JSON.stringify(file)})`;
      }
      const importName = `${k}_${i.toString()}`;
      imports.push({
        type: "namespace",
        name: importName,
        specifier: `${toImportPath(file.absolutePath, outDir2)}?collection=${k}&hash=${hash}`
      });
      return `toRuntime("${collection.type}", ${importName}, ${JSON.stringify(file)})`;
    });
    const resolvedItems = await Promise.all(items);
    if (collection.transform) {
      if (config.global) importedCollections.add("default");
      importedCollections.add(k);
    }
    return collection.transform ? `export const ${k} = await Promise.all([${resolvedItems.join(", ")}].map(v => c_${k}.transform(v, ${config.global ? "c_default" : "undefined"})));` : `export const ${k} = [${resolvedItems.join(", ")}];`;
  });
  const resolvedDeclares = await Promise.all(declares);
  if (importedCollections.size > 0) {
    imports.push({
      type: "named",
      names: Array.from(importedCollections.values()).sort().map((v) => [v, `c_${v}`]),
      specifier: toImportPath(configPath, outDir2)
    });
  }
  return [...imports.map(getImportCode), ...resolvedDeclares].join("\n");
}
async function getCollectionFiles(collection) {
  const files = /* @__PURE__ */ new Map();
  const dirs = Array.isArray(collection.dir) ? collection.dir : [collection.dir];
  await Promise.all(
    dirs.map(async (dir) => {
      const result = await fg(collection.files ?? "**/*", {
        cwd: path.resolve(dir),
        absolute: true
      });
      result.forEach((item) => {
        if (getTypeFromPath(item) !== collection.type) return;
        files.set(item, {
          path: path.relative(dir, item),
          absolutePath: item
        });
      });
    })
  );
  return Array.from(files.values());
}
function getImportCode(info) {
  const specifier = JSON.stringify(info.specifier);
  if (info.type === "default") return `import ${info.name} from ${specifier}`;
  if (info.type === "namespace")
    return `import * as ${info.name} from ${specifier}`;
  if (info.type === "named") {
    const names = info.names.map(
      (name) => Array.isArray(name) ? `${name[0]} as ${name[1]}` : name
    );
    return `import { ${names.join(", ")} } from ${specifier}`;
  }
  return `import ${specifier}`;
}
function toImportPath(file, dir) {
  let importPath = path.relative(dir, file);
  if (!path.isAbsolute(importPath) && !importPath.startsWith(".")) {
    importPath = `./${importPath}`;
  }
  return importPath.replaceAll(path.sep, "/");
}
function generateTypes(configPath, config, outputPath) {
  const importPath = JSON.stringify(
    toImportPath(configPath, path.dirname(outputPath))
  );
  const lines = [
    'import type { GetOutput } from "fumadocs-mdx/config"'
  ];
  for (const name of config.collections.keys()) {
    lines.push(
      `export declare const ${name}: GetOutput<typeof import(${importPath}).${name}>`
    );
  }
  return lines.join("\n");
}

// src/map/index.ts
async function start(dev, configPath, outDir2) {
  let configHash = await getConfigHash(configPath);
  let config = await loadConfigCached(configPath, configHash);
  const manifestPath = path2.resolve(outDir2, "manifest.json");
  const jsOut = path2.resolve(outDir2, `index.js`);
  const typeOut = path2.resolve(outDir2, `index.d.ts`);
  const frontmatterCache = /* @__PURE__ */ new Map();
  let hookUpdate = false;
  const readFrontmatter = async (file) => {
    const cached = frontmatterCache.get(file);
    if (cached) return cached;
    hookUpdate = true;
    return grayMatter({
      content: await readFile(file).then((res) => res.toString())
    }).data;
  };
  fs.mkdirSync(outDir2, { recursive: true });
  fs.writeFileSync(
    jsOut,
    await generateJS(configPath, config, jsOut, configHash, readFrontmatter)
  );
  fs.writeFileSync(typeOut, generateTypes(configPath, config, typeOut));
  console.log("[MDX] initialized map file");
  if (dev) {
    const { watcher } = await import("../watcher-7ALL6XOY.js");
    const instance = watcher(configPath, config);
    instance.on("ready", () => {
      console.log("[MDX] started dev server");
    });
    instance.on("all", (event, file) => {
      const onUpdate = async () => {
        const isConfigFile = path2.resolve(file) === configPath;
        if (isConfigFile) {
          configHash = await getConfigHash(configPath);
          config = await loadConfigCached(configPath, configHash);
          await writeFile(typeOut, generateTypes(configPath, config, typeOut));
          console.log("[MDX] Updated map types");
        }
        if (isConfigFile || event !== "change" || hookUpdate) {
          if (event === "change") frontmatterCache.delete(file);
          await writeFile(
            jsOut,
            await generateJS(
              configPath,
              config,
              jsOut,
              configHash,
              readFrontmatter
            )
          );
          console.log("[MDX] Updated map file");
        }
      };
      void onUpdate();
    });
    process.on("exit", () => {
      console.log("[MDX] closing dev server");
      void instance.close();
    });
  }
  if (config.global?.generateManifest && !dev) {
    process.on("exit", () => {
      console.log("[MDX] writing manifest");
      writeManifest(manifestPath, config);
    });
  }
}

// src/next/create.ts
var outDir = path3.resolve(".source");
var defaultPageExtensions = ["mdx", "md", "jsx", "js", "tsx", "ts"];
function createMDX({
  configPath = findConfigFile()
} = {}) {
  const isDev = process.argv.includes("dev");
  const isBuild = process.argv.includes("build");
  if ((isDev || isBuild) && process.env._FUMADOCS_MDX !== "1") {
    process.env._FUMADOCS_MDX = "1";
    void start(isDev, configPath, outDir);
  }
  return (nextConfig = {}) => {
    const mdxLoaderOptions = {
      _ctx: {
        configPath
      }
    };
    return {
      ...nextConfig,
      experimental: {
        ...nextConfig.experimental,
        turbo: {
          ...nextConfig.experimental?.turbo,
          rules: {
            ...nextConfig.experimental?.turbo?.rules,
            // @ts-expect-error -- safe types
            "*.{md,mdx}": {
              loaders: [
                {
                  loader: "fumadocs-mdx/loader-mdx",
                  options: mdxLoaderOptions
                }
              ],
              as: "*.js"
            }
          }
        }
      },
      pageExtensions: nextConfig.pageExtensions ?? defaultPageExtensions,
      webpack: (config, options) => {
        config.resolve ||= {};
        config.module ||= {};
        config.module.rules ||= [];
        config.module.rules.push({
          test: /\.mdx?$/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: "fumadocs-mdx/loader-mdx",
              options: mdxLoaderOptions
            }
          ]
        });
        config.plugins ||= [];
        return nextConfig.webpack?.(config, options) ?? config;
      }
    };
  };
}

// src/postinstall.ts
import path4 from "node:path";
import fs2 from "node:fs";
async function postInstall(configPath = findConfigFile()) {
  const typeOut = path4.resolve(".source/index.d.ts");
  const config = await loadConfig(configPath);
  fs2.mkdirSync(path4.dirname(typeOut), { recursive: true });
  fs2.writeFileSync(typeOut, generateTypes(configPath, config, typeOut));
  console.log("[MDX] types generated");
}
export {
  createMDX,
  postInstall,
  start
};
