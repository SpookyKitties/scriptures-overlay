export async function parseHtmlTagAttr(
  document: Document,
  attr: string,
): Promise<string> {
  const lang = document.querySelector('html')?.getAttribute(attr);
  if (lang) {
    return lang;
  }

  throw new Error(`No ${attr} attribute found in settings file`);
}
