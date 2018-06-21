type Asset = string;
type BundledEvent = 'bundled';
type BuildEndEvent = 'buildEnd';
type LogLevel = 3 | 2 | 1;
type Target = 'browser' | 'node' | 'electron';
type Type = 'js' | 'css' | 'map';

interface BundlerOptions {
  outDir?: string;
  outFile?: string;
  publicUrl?: string;
  watch?: boolean;
  cache?: boolean;
  cacheDir?: string;
  minify?: boolean;
  target?: Target;
  https?: boolean;
  logLevel?: LogLevel;
  hmrPort?: number;
  hmrHostname?: string;
  sourceMaps?: boolean;
  detailedReport?: boolean;
}

declare class Bundle {
  type: Type;
  name: string;
  parentBundle: Bundle | null;
  entryAsset: Asset;
  assets: Set<Asset>;
  childBundles: Set<Bundle>;
  siblingBundles: Set<Bundle>;
  siblingBundlesMap: Map<Type, Bundle>;
  offsets: Map<Asset, number>;
}

declare module 'parcel-bundler' {
  class Bundler {
    constructor(file: string, options?: BundlerOptions);

    bundle(): Promise<Bundle>;

    on(event: BundledEvent, cb: (bundle: Bundle) => void): void;
    on(event: BuildEndEvent, cb: () => void): void;
  }

  export = Bundler;
}
