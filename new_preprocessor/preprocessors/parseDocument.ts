import { parseDocumentNode } from './parseDocumentNode';
import { parseDocumentWeb } from './parseDocumentWeb';

export async function parseDocument(
  file: File | Buffer,
  contentType?: string,
): Promise<Document> {
  if (typeof (file as File).text === 'function') {
    return parseDocumentWeb(await (file as File).text());
  } else {
    return parseDocumentNode((file as Buffer).toString(), contentType);
  }
}
