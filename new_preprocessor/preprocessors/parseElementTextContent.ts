import { decode } from 'he';

export async function parseElementTextContent(
  document: Document,
  selector: string,
): Promise<string> {
  const elm = document.querySelector(selector);

  return elm?.textContent ? decode(elm.textContent) : '';
}
