export async function parseDocumentWeb(file: string): Promise<Document> {
  const parser = new DOMParser();

  return parser.parseFromString(file, 'text/xml');
}
