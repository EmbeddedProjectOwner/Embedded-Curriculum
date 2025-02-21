import * as fs from "node:fs";
import { DirectoryStorage, dirType } from "../store";

const isProd = process.env.NODE_ENV ?? "production"

export function ScanDirectoryForTags(dir: string, dirType: dirType) {
    if (isProd) {
        DirectoryStorage.Scans
    }
}