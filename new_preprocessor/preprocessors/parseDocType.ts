import { DataContentType } from "./DataContentType";

export async function parseDocType(
  document: Document,
): Promise<DataContentType | undefined> {
  const dataContentType =  document
    .querySelector('[data-content-type]')
    ?.getAttribute('data-content-type');
  switch (dataContentType) {
    case 'book':
    case 'section':
    case 'table-of-contents':
    case 'figure':
    case 'chapter': {
      return DataContentType.SCRIPTURES;
    }
    case 'overlay-note': {
      return DataContentType.OVERLAYNOTE;
    }
    default:
      return undefined;
  }
}
