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

      function replaceAttr(element: CheerioElement, attr: string): void {
        let value = $(element).attr(attr);

        if (value.startsWith('/')) {
          let file = value.substring(1);
          let uri = vscode.Uri.file(project.filePath(`dist/${file}`));

          $(element).attr(attr, uri.with({ scheme: 'vscode-resource' }));
        }
      }

      $('script').each((_index, element) => {
        replaceAttr(element, 'src');
      });

      $('link').each((_index, element) => {
        replaceAttr(element, 'href');
      });

      $('img').each((_index, element) => {
        replaceAttr(element, 'src');
      });

      await this.dest.write($.html());
    }
  };
}
