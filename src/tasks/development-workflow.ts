import * as vscode from 'vscode';
import * as fse from 'fs-extra';

import Project from '../project';
import buildProject from './build-project';

export default async function developProject(activeProject: Project) {
  await buildProject(activeProject);

  let panel = vscode.window.createWebviewPanel(
    'courier',
    'Courier: Live View',
    vscode.ViewColumn.Three,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(activeProject.rootPath)]
    }
  );

  let indexFileContent = await fse.readFile(
    await activeProject.filePath('dist/index.html')
  );
  panel.webview.html = indexFileContent.toString();

  let saveListener = vscode.workspace.onDidSaveTextDocument(async () => {
    panel.title = 'Courier: Rebuilding...';

    await buildProject(activeProject!);

    let indexFileContent = await fse.readFile(
      await activeProject!.filePath('dist/index.html')
    );

    panel.title = 'Courier: Live View';
    panel.webview.html = indexFileContent.toString();
  });

  // Stop listening for save events if the preview is closed
  panel.onDidDispose(() => {
    saveListener.dispose();
  });
}
