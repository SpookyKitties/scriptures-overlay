import { FormatGroup } from '../lib/models/Chapter/FormatGroup';
import { parseBodyFormatGroups } from './parseBodyFormatGroups';
import { parseElementAttrs } from './parseElementAttrs';

export async function parseBody(document: Document): Promise<FormatGroup> {
  const bodyTag = document.querySelector('body');
  const headTag = document.querySelector('head')?.childNodes;
  if (bodyTag && headTag) {
    const attrs = await parseElementAttrs(bodyTag);

    const formatGroups = await Promise.all(
      Array.from(bodyTag.childNodes)
        .filter(
          (node) =>
            node.nodeName.toLowerCase() !== '#text' &&
            node.nodeName.toLowerCase() !== 'lds:meta',
        )
        .map((node) => parseBodyFormatGroups(node as Element)),
    );
    return new FormatGroup(bodyTag.nodeName.toLowerCase(), formatGroups, attrs);
  }

  throw new Error('No body tag found.');
}
