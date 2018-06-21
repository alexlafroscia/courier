import * as path from 'path';

import * as vscode from 'vscode';
import * as fse from 'fs-extra';

import Project from '../project';

export default async function projectFromWorkspace(
  folder: vscode.WorkspaceFolder,
  context: vscode.ExtensionContext
): Promise<Project | undefined> {
  let root = folder.uri.path;
  let marker = path.join(root, '.courier-project');

  if (await fse.exists(marker)) {
    let info = path.parse(root);
    let project = new Project(info.name);

    await project.setup(context);

    return project;
  }
}
