import * as path from "path";
import * as vscode from "vscode";
import * as fse from "fs-extra";

import Project from "../project";
import generateName from "../utils/generate-name";
import getProjectPath from "../utils/storage-path";

export default async function createProject(context: vscode.ExtensionContext): Promise<Project> {
  let defaultName = generateName();
  let response = await vscode.window.showInputBox({
    placeHolder: defaultName,
    prompt: "What do you want to call your project?"
  });

  if (!response) {
    response = defaultName;
  }

  let storagePath = await getProjectPath(context);
  let projectPath = path.join(storagePath, response);

  await fse.mkdir(projectPath);

  let projectTemplate = context.asAbsolutePath('template');

  await fse.copy(projectTemplate, projectPath);

  vscode.window.showInformationMessage(`Created project: ${response}`);

  return new Project(response, context);
}
