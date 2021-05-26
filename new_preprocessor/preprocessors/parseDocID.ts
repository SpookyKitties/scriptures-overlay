import { parseLang } from './parseLang';

export async function parseDocID(document: Document): Promise<string> {
  const dataUriAttr = document.querySelector('html')?.getAttribute('data-uri');

  if (dataUriAttr) {
    const regExp = /^.+\/(.+?)\/(.+?)(\.html$|$)/g.exec(dataUriAttr);

    if (regExp) {
      const lang = await parseLang(document);

      return `${lang}-${regExp[1]}-${regExp[2]}-chapter`;
    }
  }

  throw new Error('No document id found');
}
