// src/runtime/resolve-files.ts
function resolveFiles({
  docs,
  meta,
  rootDir = ""
}) {
  const outputs = [];
  for (const entry of docs) {
    if (!entry._file.path.startsWith(rootDir)) continue;
    outputs.push({
      type: "page",
      path: entry._file.path,
      data: entry
    });
  }
  for (const entry of meta) {
    outputs.push({
      type: "meta",
      path: entry._file.path,
      data: entry
    });
  }
  return outputs;
}

// src/runtime/index.ts
function toRuntime(type, file, info) {
  if (type === "doc") {
    const { default: body, frontmatter, ...exports } = file;
    return {
      body,
      ...exports,
      ...frontmatter,
      _exports: file,
      _file: info
    };
  }
  return {
    ...file.default,
    _file: info
  };
}
function toRuntimeAsync(frontmatter, load, info) {
  return {
    async load() {
      const { default: body, ...res } = await load();
      return {
        body,
        ...res
      };
    },
    ...frontmatter,
    _file: info
  };
}
function createMDXSource(docs, meta) {
  return {
    files: (rootDir) => resolveFiles({
      docs,
      meta,
      rootDir
    })
  };
}
export {
  createMDXSource,
  toRuntime,
  toRuntimeAsync
};
