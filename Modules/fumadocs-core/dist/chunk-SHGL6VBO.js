// src/utils/path.ts
function splitPath(path) {
  return path.split("/").filter((p) => p.length > 0);
}
function resolvePath(from, join) {
  const v1 = splitPath(from), v2 = splitPath(join);
  while (v2.length > 0) {
    switch (v2[0]) {
      case "..":
        v1.pop();
        break;
      case ".":
        break;
      default:
        v1.push(v2[0]);
    }
    v2.shift();
  }
  return v1.join("/");
}
function slash(path) {
  const isExtendedLengthPath = path.startsWith("\\\\?\\");
  if (isExtendedLengthPath) {
    return path;
  }
  return path.replaceAll("\\", "/");
}

export {
  splitPath,
  resolvePath,
  slash
};
