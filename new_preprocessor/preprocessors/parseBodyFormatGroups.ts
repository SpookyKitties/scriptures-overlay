import { FormatGroup } from '../lib/models/Chapter/FormatGroup';
import { VersePlaceholder } from '../lib/models/Chapter/VersePlaceholder';
import { parseElementAttrs } from './parseElementAttrs';
import { parseVerseID } from './parseVerseID';

export async function parseBodyFormatGroups(
  elm: Element,
): Promise<FormatGroup | VersePlaceholder> {
  if (elm.hasAttribute('data-aid')) {
    return { v: parseVerseID(elm.id) };
  }
  const name = elm.nodeName.toLowerCase();
  const attrs = await parseElementAttrs(elm);
  const formatGroups = await Promise.all(
    Array.from(elm.childNodes)
      .filter(
        (node) =>
          node.nodeName.toLowerCase() !== '#text' &&
          node.nodeName.toLowerCase() !== 'lds:meta',
      )
      .map((node) => parseBodyFormatGroups(node as Element)),
  );

  return new FormatGroup(name, formatGroups, attrs);
}
