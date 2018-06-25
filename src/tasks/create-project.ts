import * as path from 'path';
import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as execa from 'execa';

import Project from '../project';
import generateName from '../utils/generate-name';
import getProjectPath from '../utils/storage-path';

/**
 * Create a new Project
 *
 * @param context The current extension context
 */
export default async function createProject(
  context: vscode.ExtensionContext
): Promise<Project> {
  let defaultName = generateName();
  let response = await vscode.window.showInputBox({
    placeHolder: defaultName,
    prompt: 'What do you want to call your project?'
  });

  if (!response) {
    response = defaultName;
  }

  let projectCreationMessage = vscode.window.setStatusBarMessage(
    `Creating Project: ${response}`
  );

  let storagePath = await getProjectPath(context);
  let projectPath = path.join(storagePath, response);

  await fse.mkdir(projectPath);

  let projectTemplate = context.asAbsolutePath('template');

  await fse.copy(projectTemplate, projectPath);

  await execa('npm', ['init', '-y'], {
    cwd: projectPath
  });

  projectCreationMessage.dispose();
  vscode.window.showInformationMessage(`Created project: ${response}`);

  let project = new Project(response);

  await project.setup(context);

  return project;
}
