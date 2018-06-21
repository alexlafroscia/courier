import * as vscode from 'vscode';

import Project from './project';

import develop from './tasks/development-workflow';
import createProject from './tasks/create-project';
import openProject from './tasks/open-project';
import pickProject from './tasks/pick-project';
import projectFromFolder from './utils/project-from-folder';

export async function activate(context: vscode.ExtensionContext) {
  let activeProject: Project | undefined,
    workspaceFolder =
      vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];

  if (workspaceFolder) {
    activeProject = await projectFromFolder(workspaceFolder, context);
  }

  if (activeProject) {
    context.workspaceState.update('active-project', activeProject);

    await develop(activeProject);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('courier.createProject', async () => {
      let project = await createProject(context);

      await openProject(project);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('courier.openProject', async () => {
      let project = await pickProject(context);

      if (project) {
        await openProject(project);
      } else {
        vscode.window.showErrorMessage('Could not find a matching project');
      }
    })
  );
}
