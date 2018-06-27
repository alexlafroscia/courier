type BundledEvent = 'bundled';
type BuildEndEvent = 'buildEnd';
type LogLevel = 3 | 2 | 1;
type Target = 'browser' | 'node' | 'electron';
type Type = 'html' | 'js' | 'css' | 'map';

interface File {
  html?: string;
}

interface Asset {
  basename: string;
  buildTime: number;
  bundledSize: number;
  encoding: string;
  endTime: number;
  generated: File;
  hash: string;
  id: number;
  isAstDirty: boolean;
  name: string;
  parentBundle: Bundle;
  relativeName: string;
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

declare class Destination {
  write(content: any): Promise<void>;
}

declare module '@alexlafroscia/parcel-bundler' {
  import * as stream from 'stream';

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
    logStream?: stream.Writable;
    logLevel?: LogLevel;
    hmrPort?: number;
    hmrHostname?: string;
    sourceMaps?: boolean;
    detailedReport?: boolean;
  }

  class Bundler {
    constructor(file: string, options?: BundlerOptions);

    bundle(): Promise<Bundle>;

    on(event: BundledEvent, cb: (bundle: Bundle) => void): void;
    on(event: BuildEndEvent, cb: () => void): void;

    addPackager(type: Type, path: string): void;
    addPackager(type: Type, path: typeof Bundler.Packager): void;
  }

  namespace Bundler {
    export class Packager {
      dest: Destination;

      addAsset(asset: Asset): Promise<void>;
    }
  }

  export = Bundler;
}
