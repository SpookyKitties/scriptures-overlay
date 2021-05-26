import { parseElmAttr } from './notes-processor/parseElmAttr';

export async function parseChapterLang(document: Document): Promise<string> {
  const htmlTag = document.querySelector('html');
  if (htmlTag) {
    const lang = parseElmAttr(htmlTag, 'lang');
    if (lang.trim() !== '') {
      return lang;
    }
  }

  throw new Error('No language found');
}
