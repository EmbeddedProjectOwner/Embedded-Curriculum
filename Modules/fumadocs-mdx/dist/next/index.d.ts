import { NextConfig } from 'next';

/**
 * Start a MDX server that builds index and manifest files.
 *
 * In development mode, it starts a file watcher to auto-update output as your input changes.
 */
declare function start(dev: boolean, configPath: string, outDir: string): Promise<void>;

interface CreateMDXOptions {
    /**
     * Path to source configuration file
     */
    configPath?: string;
}

declare function createMDX({ configPath, }?: CreateMDXOptions): (nextConfig?: NextConfig) => NextConfig;

declare function postInstall(configPath?: string): Promise<void>;

export { type CreateMDXOptions, createMDX, postInstall, start };
