/* eslint-disable @typescript-eslint/ban-types */
import { decode } from 'he';
import { Chapter } from '../../lib/models/Chapter/Chapter';
import { DocType } from '../../lib/models/Chapter/DocType';
import { FormatGroup } from '../../lib/models/Chapter/FormatGroup';
import { FormatText } from '../../lib/models/Chapter/FormatText';
import { Verse } from '../../lib/models/Chapter/Verse';
import { parseBody } from '../parseBody';
import { parseChapterLang } from '../parseChapterLang';
import { parseDocID } from '../parseDocID';
import { parseElementAttrs } from '../parseElementAttrs';
import { parseElementTextContent } from '../parseElementTextContent';
import { parseVerseID } from '../parseVerseID';
export async function parseVerseFormatTags(
  elm: Element,
  count: { count: number },
): Promise<FormatGroup[] | FormatText[]> {
  if (elm.nodeName.toLowerCase() === '#text' && elm.textContent) {
    const txt = decode(elm.textContent);

    const offsets = [count.count, count.count + txt.length];
    let ft: FormatText;
    if (offsets[0] === offsets[1]) {
      ft = {
        offsets: '',
        uncompressedOffsets: undefined,
        docType: DocType.FORMATTEXT,
      };
      return [ft];
    } else {
      ft = {
        offsets: `${count.count}-${count.count + txt.length - 1}`,
        uncompressedOffsets: undefined,
        docType: DocType.FORMATTEXT,
      };

      count.count = count.count + txt.length;
      return [ft];
    }
  } else {
    const formatTags = await Promise.all(
      Array.from(elm.childNodes).map(async (childNode) => {
        const formatTags = await parseVerseFormatTags(
          childNode as Element,
          count,
        );
        const name = childNode.nodeName.toLowerCase();
        if (name === '#text') {
          return formatTags[0];
        }
        const attrs = await parseElementAttrs(childNode as Element);
        return new FormatGroup(name, formatTags, attrs);
      }),
    );
    return formatTags;
  }
}
export async function parseVerses(document: Document): Promise<Verse[]> {
  const verses = Array.from(document.querySelectorAll('[data-aid]')).map(
    async (verseElm) => {
      const id = parseVerseID(verseElm.id);
      const text = verseElm.textContent ? verseElm.textContent : '';
      const name = verseElm.nodeName.toLowerCase();
      const attrs = await parseElementAttrs(verseElm);
      const grps = await parseVerseFormatTags(verseElm, { count: 0 });
      return new Verse(id, text, grps, name, attrs);
    },
  );
  return Promise.all(verses);
}

async function removeUnneededElements(document: Document): Promise<void> {
  Array.from(document.querySelectorAll('.study-notes')).map((elm) =>
    elm.remove(),
  );
}

export async function chapterProcessor(document: Document): Promise<Chapter> {
  await removeUnneededElements(document);
  const lang = await parseChapterLang(document);
  const title = await parseElementTextContent(document, '[type=navigation]');
  const shortTitle = await parseElementTextContent(
    document,
    '[type*=short-citation]',
  );
  const testament = '';
  const id = await parseDocID(document);
  const verses: Verse[] = await parseVerses(document);
  const body: FormatGroup = await parseBody(document);
  return new Chapter(id, lang, title, shortTitle, testament, verses, body);
}
