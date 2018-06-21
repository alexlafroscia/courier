import * as fse from 'fs-extra';

import Project from '../project';

export default async function deleteProject(project: Project): Promise<void> {
  let directory = project.rootPath;

  await fse.emptyDir(directory);
  await fse.remove(directory);
}
