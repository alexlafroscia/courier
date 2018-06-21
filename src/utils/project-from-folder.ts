import * as path from 'path';

import * as vscode from 'vscode';
import * as fse from 'fs-extra';

import Project from '../project';

/**
 * Create a Project from a folder on disk
 *
 * @param folder The folder create a project from
 * @param context The extension context
 */
export default async function projectFromFolder(
  folder: vscode.WorkspaceFolder | string,
  context: vscode.ExtensionContext
): Promise<Project | undefined> {
  let root;

  if (typeof folder === 'string') {
    root = folder;
  } else {
    root = folder.uri.path;
  }

  let marker = path.join(root, '.courier-project');

  if (await fse.exists(marker)) {
    let info = path.parse(root);
    let project = new Project(info.name);

    await project.setup(context);

    return project;
  }
}
