import * as vscode from 'vscode';
import Bundler = require('parcel-bundler');
import cheerio = require('cheerio');

import Project from '../project';

export default function createLinkRewriter(
  project: Project
): typeof Bundler.Packager {
  return class extends Bundler.Packager {
    async addAsset(asset: Asset) {
      let originalContent = asset.generated.html;
      let $ = cheerio.load(originalContent!);

      $('script').each(async (_index, element) => {
        let src = $(element).attr('src');

        if (src.startsWith('/')) {
          let file = src.substring(1);
          let uri = vscode.Uri.file(project.filePath(`dist/${file}`));

          $(element).attr('src', uri.with({ scheme: 'vscode-resource' }));
        }
      });

      $('link').each(async (_index, element) => {
        let href = $(element).attr('href');

        if (href.startsWith('/')) {
          let file = href.substring(1);
          let uri = vscode.Uri.file(project.filePath(`dist/${file}`));

          $(element).attr('href', uri.with({ scheme: 'vscode-resource' }));
        }
      });

      await this.dest.write($.html());
    }
  };
}
