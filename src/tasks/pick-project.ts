import * as path from 'path';

import * as vscode from 'vscode';
import * as fse from 'fs-extra';

import Project from '../project';
import projectFromFolder from '../utils/project-from-folder';
import storagePath from '../utils/storage-path';

/**
 * Select an existing Project
 *
 * @param context The current extension context
 * @param options.placeHolder Placeholder text to show in picker menu
 */
export default async function pickProject(
  context: vscode.ExtensionContext,
  options: vscode.QuickPickOptions = {}
): Promise<Project | undefined> {
  let projectRoot = await storagePath(context);
  let projects = await fse.readdir(projectRoot);
  let selection = await vscode.window.showQuickPick(projects, options);

  if (selection) {
    let fullPath = path.join(projectRoot, selection);

    return projectFromFolder(fullPath, context);
  }
}
