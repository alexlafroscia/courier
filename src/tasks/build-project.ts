import * as vscode from 'vscode';
import Bundler = require('@alexlafroscia/parcel-bundler');

import Project from '../project';

export default async function buildProject(
  project: Project,
  buildLabel: string = 'Building...'
): Promise<Bundler> {
  let bundler = await project.makeBundler();
  let buildPromise = bundler.bundle();

  vscode.window.setStatusBarMessage(buildLabel, buildPromise);

  await buildPromise;

  return bundler;
}
