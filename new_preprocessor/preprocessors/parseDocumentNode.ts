import { JSDOM } from 'jsdom';

export async function parseDocumentNode(
  file: string,
  contentType?: string,
): Promise<Document> {
  return new JSDOM(file, {
    contentType: contentType ? contentType : 'text/html',
  }).window.document;
}
