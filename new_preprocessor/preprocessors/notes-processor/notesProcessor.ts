import { NoteCategoryNew } from '../../lib/models/Settings/NoteCategory';
import { NoteOverlayNew } from '../../lib/models/Settings/NoteOverlay';
import { NoteSettingsNew } from '../../lib/models/Settings/NoteSettings';
import { Note } from '../../lib/models/VerseNotes/Note';
import { NoteRef } from '../../lib/models/VerseNotes/NoteRef';
import { VerseNote } from '../../lib/models/VerseNotes/VerseNote';
import { parseElmAttr } from './parseElmAttr';

export function parseNoteCategory(
  elm: Element,
  noteSettings: NoteSettingsNew,
): NoteCategoryNew | undefined {
  const categoryAttr = parseElmAttr(elm, 'category-type');
  return noteSettings.noteCategories.find(
    noteCategory =>
      noteCategory.className.toLowerCase() ===
      `reference-label-${categoryAttr}`,
  );
}

export function parseNoteOverlay(
  noteElm: Element,
  noteSettings: NoteSettingsNew,
): NoteOverlayNew | undefined {
  const overlayAttr = noteElm.className;

  return noteSettings.noteOverlays.find(
    noteOverlay => noteOverlay.className === overlayAttr,
  );
}
export async function parseNote(
  noteElm: Element,
  noteSettings: NoteSettingsNew,
): Promise<Note> {
  const notePhrase = noteElm.querySelector('.note-phrase')?.innerHTML;
  const noteRef = Array.from(noteElm.querySelectorAll('.note-reference')).map(
    noteRefElm => {
      const text = noteRefElm.innerHTML;
      const category = parseNoteCategory(noteRefElm, noteSettings);

      return new NoteRef(text, category?.category);
    },
  );

  const verseMarker = parseElmAttr(noteElm, 'verse-marker');
  const noteMarker = parseElmAttr(noteElm, 'note-marker');
  const offsets = parseElmAttr(noteElm, 'offsets');
  const overlay = parseNoteOverlay(noteElm, noteSettings);
  const sourceID = parseElmAttr(noteElm, 'sourceID');

  if (overlay) {
    return new Note(
      noteElm.id,
      noteRef,
      offsets,
      verseMarker,
      noteMarker,
      overlay?.overlay,
      notePhrase,
      sourceID,
    );
  }
  throw new Error(
    `No overlay found on note with id: ${noteElm.id}     ${noteElm.outerHTML}`,
  );
}

export async function parseNotes(
  verseNotesElm: Element,
  noteSettings: NoteSettingsNew,
): Promise<Note[]> {
  return await Promise.all(
    Array.from(verseNotesElm.querySelectorAll('note')).map(async noteElm => {
      return parseNote(noteElm, noteSettings);
    }),
  );
  // return new VerseNote(verseNotesElm.id, notes);
}

export async function parseVerseNotes(
  chapterVerseNotesElm: Element,
  noteSettings: NoteSettingsNew,
): Promise<VerseNotesFile> {
  const verseNotes = await Promise.all(
    Array.from(chapterVerseNotesElm.querySelectorAll('verse-notes')).map(
      async verseNotesElm => {
        const notes = await parseNotes(verseNotesElm, noteSettings);
        return new VerseNote(verseNotesElm.id, notes);
      },
    ),
  );

  return { chapterID: chapterVerseNotesElm.id, verseNotes: verseNotes };
}

export interface VerseNotesFile {
  chapterID: string;
  verseNotes: VerseNote[];
}
export async function parseVerseNotesChapter(
  document: Document,
  noteSettings: NoteSettingsNew,
): Promise<VerseNotesFile[]> {
  return Promise.all(
    Array.from(document.querySelectorAll('testament chapter,book chapter')).map(
      (chapterVerseNotesElm: Element) => {
        return parseVerseNotes(chapterVerseNotesElm, noteSettings);
      },
    ),
  );
}
export async function notesProcessor(
  document: Document,
  noteSettings: NoteSettingsNew,
): Promise<VerseNotesFile[]> {
  return parseVerseNotesChapter(document, noteSettings);
}
