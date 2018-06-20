import * as vscode from "vscode";

import createProject from "./tasks/create-project";
import openProject from "./tasks/open-project";

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("courier.createProject", async () => {
      let project = await createProject(context);

      await openProject(project);
    })
  );
}
