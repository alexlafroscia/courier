import EventEmitter = require('events');
import * as vscode from 'vscode';

import Project from '../project';

const BUILD_SIGIL = '⏳ ';

function clean(log: string) {
  return log.trim().replace(BUILD_SIGIL, '');
}

function filterBuildLogs(log: string) {
  return log.startsWith(BUILD_SIGIL);
}

export default async function buildProject(project: Project): Promise<void> {
  let emitter = new EventEmitter();

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Building Courier project'
    },
    async progress => {
      emitter.on('log', (chunk: string | Buffer) => {
        if (chunk instanceof Buffer) {
          chunk = chunk.toString();
        }

        if (filterBuildLogs(chunk)) {
          progress.report({ message: clean(chunk) });
        }
      });

      let bundler = await project.makeBundler(emitter);

      await bundler.bundle();
    }
  );
}
