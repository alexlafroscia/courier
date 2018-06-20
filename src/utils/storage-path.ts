import * as vscode from "vscode";
import { ensureDir } from "fs-extra";

export default async function storagePath(
  context: vscode.ExtensionContext
): Promise<string> {
  const path = context.asAbsolutePath("_projects");

  await ensureDir(path);

  return path;
}
