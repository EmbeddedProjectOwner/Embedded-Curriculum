// src/map/watcher.ts
import { watch } from "chokidar";
function watcher(configPath, config) {
  const deps = [configPath];
  for (const collection of config.collections.values()) {
    if (Array.isArray(collection.dir)) deps.push(...collection.dir);
    else deps.push(collection.dir);
  }
  return watch(deps, {
    ignoreInitial: true,
    persistent: true
  });
}
export {
  watcher
};
