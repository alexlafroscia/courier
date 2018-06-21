import * as path from 'path';

import * as vscode from 'vscode';
import Bundler = require('parcel-bundler');

import getProjectPath from './utils/storage-path';
import generateLinkRewriter from './parcel/html-link-rewriter';

export default class Project {
  name: string;

  private projectDirectory: string = '';

  constructor(name: string) {
    this.name = name;
  }

  async setup(context: vscode.ExtensionContext) {
    this.projectDirectory = await getProjectPath(context);
  }

  get rootPath(): string {
    if (!this.projectDirectory) {
      debugger;

      throw new Error('Project has not been set up');
    }

    return path.join(this.projectDirectory, this.name);
  }

  filePath(file: string): string {
    return path.join(this.rootPath, file);
  }

  /**
   * Begin building the Parcel project
   */
  async makeBundler(): Promise<Bundler> {
    let entry = await this.filePath('index.html');
    let bundler = new Bundler(entry, {
      outDir: this.filePath('dist'),
      cacheDir: this.filePath('.cache'),
      watch: false
    });

    bundler.addPackager('html', generateLinkRewriter(this));

    return bundler;
  }
}
