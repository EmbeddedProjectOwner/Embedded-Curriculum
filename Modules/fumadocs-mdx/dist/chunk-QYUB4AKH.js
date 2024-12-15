// src/config/cached.ts
import { createHash } from "node:crypto";
import fs from "node:fs";

// src/config/load.ts
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

// src/config/validate.ts
function validateConfig(config) {
  const out = {
    collections: /* @__PURE__ */ new Map(),
    _runtime: {
      files: /* @__PURE__ */ new Map()
    }
  };
  for (const [k, v] of Object.entries(config)) {
    if (!v) {
      continue;
    }
    if (typeof v === "object" && "_doc" in v && v._doc === "collections") {
      out.collections.set(
        k,
        v
      );
      continue;
    }
    if (k === "default") {
      out.global = v;
      continue;
    }
    return [
      `Unknown export "${k}", you can only export collections from source configuration file.`,
      null
    ];
  }
  return [null, out];
}

// src/config/load.ts
function findConfigFile() {
  return path.resolve("source.config.ts");
}
async function loadConfig(configPath) {
  const outputPath = path.resolve(".source/source.config.mjs");
  const transformed = await build({
    entryPoints: [{ in: configPath, out: "source.config" }],
    bundle: true,
    outdir: ".source",
    target: "node18",
    write: true,
    platform: "node",
    format: "esm",
    packages: "external",
    outExtension: {
      ".js": ".mjs"
    },
    allowOverwrite: true,
    splitting: true
  });
  if (transformed.errors.length > 0) {
    throw new Error("failed to compile configuration file");
  }
  const url = pathToFileURL(outputPath);
  const [err, config] = validateConfig(
    // every call to `loadConfig` will cause the previous cache to be ignored
    await import(`${url.toString()}?hash=${Date.now().toString()}`)
  );
  if (err !== null) throw new Error(err);
  return config;
}

// src/config/cached.ts
var cache = /* @__PURE__ */ new Map();
async function loadConfigCached(configPath, hash) {
  const cached = cache.get(configPath);
  if (cached && cached.hash === hash) {
    return await cached.config;
  }
  const config = loadConfig(configPath);
  cache.set(configPath, { config, hash });
  return await config;
}
async function getConfigHash(configPath) {
  const hash = createHash("sha256");
  const rs = fs.createReadStream(configPath);
  for await (const chunk of rs) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}

// src/map/manifest.ts
import fs2 from "node:fs";
import path2 from "node:path";

// src/utils/get-type-from-path.ts
import { extname } from "node:path";
var docTypes = [".mdx", ".md"];
var metaTypes = [".json", ".yaml"];
function getTypeFromPath(path3) {
  const ext = extname(path3);
  if (docTypes.includes(ext)) return "doc";
  if (metaTypes.includes(ext)) return "meta";
}

// src/map/manifest.ts
function getManifestEntryPath(originalPath) {
  const toName = path2.relative(process.cwd(), originalPath).replaceAll(`..${path2.sep}`, "-").replaceAll(path2.sep, "_");
  return path2.resolve(".next/cache/fumadocs", `${toName}.json`);
}
function writeManifest(to, config) {
  const output = { files: [] };
  for (const [file, collection] of config._runtime.files.entries()) {
    const type = config.collections.get(collection)?.type ?? getTypeFromPath(file);
    if (type === "meta") continue;
    try {
      const content = fs2.readFileSync(getManifestEntryPath(file));
      const meta = JSON.parse(content.toString());
      output.files.push({
        ...meta,
        collection
      });
    } catch (e) {
      console.error(`cannot find the search index of ${file}`, e);
    }
  }
  fs2.writeFileSync(to, JSON.stringify(output));
}

export {
  findConfigFile,
  loadConfig,
  loadConfigCached,
  getConfigHash,
  getTypeFromPath,
  getManifestEntryPath,
  writeManifest
};
