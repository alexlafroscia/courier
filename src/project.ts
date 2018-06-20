import * as path from 'path';
import * as vscode from 'vscode';
import getProjectPath from './utils/storage-path';

export default class Project {
  name: string;

  private context: vscode.ExtensionContext;

  constructor(name: string, context: vscode.ExtensionContext) {
    this.name = name;
    this.context = context;
  }

  async rootPath(): Promise<string> {
    let projectPath = await getProjectPath(this.context);

    return path.join(projectPath, this.name);
  }

  async filePath(file: string): Promise<string> {
    let projectRoot = await this.rootPath();

    return path.join(projectRoot, file);
  }
}
