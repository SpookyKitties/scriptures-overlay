import { emptyDir, readFile, writeFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import normalizePath from 'normalize-path';
import { argv } from 'yargs';
import { CategoryLabel } from './CategoryLabel';
import { GSTopic } from './GSTopic';
import { Localization } from './Localization';
import { NoteMarker } from './NoteMarker';
import { NoteMarkerLocation } from './NoteMarkerLocation.1';
import { ScriptureBook } from './ScriptureBook';
export default NoteMarkerLocation;
async function parseLang(document: Document): Promise<string> {
  try {
    const langElm = document.querySelector('localization[language]');
    if (langElm) {
      return langElm.getAttribute('language') as string;
    }
  } catch (error) {
    console.log(error);
  }

  throw new Error('No language found in localization file.');
}

async function parseMarkerLocation(
  document: Document,
): Promise<NoteMarkerLocation> {
  const noteMarkerElm = document.querySelector('note-marker-location');

  if (noteMarkerElm?.textContent?.toLowerCase() === 'end') {
    return NoteMarkerLocation.END;
  }
  return NoteMarkerLocation.BEGINNING;
}

function parseMarkers(document: Document): NoteMarker[] {
  return Array.from(document.querySelectorAll('note-markers marker'))
    .map((markerElm): NoteMarker => {
      const id = markerElm.id;
      const txt = markerElm.textContent ? markerElm.textContent : '';
      return new NoteMarker(id, txt);
    })
    .filter((marker) => marker.txt !== '');
}

async function parseQuoteMarks(document: Document): Promise<[string, string]> {
  const leftQuoteMark = document.querySelector(
    'left-quotation-mark',
  )?.textContent;
  const rightQuoteMark = document.querySelector(
    'right-quotation-mark',
  )?.textContent;

  if (leftQuoteMark && rightQuoteMark) {
    return [leftQuoteMark, rightQuoteMark];
  }

  throw new Error('No quote markers found');
}

async function parseCategoryLabels(
  document: Document,
): Promise<CategoryLabel[]> {
  return Array.from(document.querySelectorAll('category-labels label')).map(
    (labelElm) => {
      const id = labelElm.id;
      const xml = labelElm.innerHTML;

      return new CategoryLabel(id, xml);
    },
  );
}
async function parseEllipse(document: Document): Promise<string> {
  const ellipses = await document.querySelector('ellipse')?.textContent;

  if (ellipses) {
    return ellipses;
  }

  throw new Error('No ellipses found');
}

async function parseScriptureBooks(
  document: Document,
): Promise<ScriptureBook[]> {
  return Array.from(document.querySelectorAll('scripture-books book'))
    .map((bookElm) => {
      const id = bookElm.id;
      const abbrElm = bookElm.querySelector('abbr');
      const fullNameElm = bookElm.querySelector('full');
      if (id && abbrElm?.textContent && fullNameElm?.textContent) {
        return new ScriptureBook(
          id,
          abbrElm.textContent,
          fullNameElm.textContent,
        );
      }
    })
    .filter((book) => book !== undefined) as ScriptureBook[];
}
async function parseGSTopics(document: Document): Promise<GSTopic[]> {
  return Array.from(document.querySelectorAll('gs-topics topic'))
    .map((topicElm) => {
      const id = topicElm.id;
      const txt = topicElm.textContent;
      if (id && txt) {
        return new GSTopic(id, txt);
      }
      return undefined;
    })
    .filter((gsTopic) => gsTopic !== undefined) as GSTopic[];
}

export async function localizationProcessor(): Promise<void> {
  const localizationFilename = argv['file'];

  await emptyDir(normalizePath('.cache/processed'));

  console.log(`Processing ${argv['file']}`);

  const document = new JSDOM(
    await readFile(normalizePath(localizationFilename as string)),
    { contentType: 'text/xml' },
  ).window.document;
  const lang = await parseLang(document);
  const markerLocation = await parseMarkerLocation(document);
  const markers = await parseMarkers(document);
  const quoteMarks = await parseQuoteMarks(document);
  const ellipses = await parseEllipse(document);
  const categoryLabels = await parseCategoryLabels(document);
  const scriptureBooks = await parseScriptureBooks(document);
  const gsTopics = await parseGSTopics(document);

  const localization = new Localization(
    lang,
    markerLocation,
    markers,
    quoteMarks[0],
    quoteMarks[1],
    ellipses,
    categoryLabels,
    scriptureBooks,
    gsTopics,
  );
  await writeFile(
    normalizePath(`.cache/${localization.id}.json`),
    JSON.stringify(localization),
  );
}
localizationProcessor();
