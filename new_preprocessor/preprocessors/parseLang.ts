export async function parseLang(document: Document): Promise<string> {
  const lang = document
    .querySelector('html,settings,[lang]')
    ?.getAttribute('lang');

  if (lang) {
    return lang;
  }

  throw new Error('No language attribute found in settings file');
}
