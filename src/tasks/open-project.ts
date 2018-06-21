import * as vscode from 'vscode';
import Project from '../project';

/**
 * Open a Project in a new VSCode window
 *
 * @param project The project to open
 */
export default async function openProject(project: Project) {
  await vscode.commands.executeCommand(
    'vscode.openFolder',
    vscode.Uri.file(project.rootPath),
    true
  );
}
