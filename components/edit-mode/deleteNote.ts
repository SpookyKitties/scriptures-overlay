import { flatMap, map } from 'rxjs/operators';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { saveChapter } from '../note-offsets/saveChapter';
import { resetNotes$ } from '../resetNotes';
import { store } from '../SettingsComponent';
import { parseVerseNumfromVerseNoteID } from '../verse-notes/parseVerseNumfromVerseNoteID';

function setNoteDeletion(
  verseNoteID: string,
  noteGroups: VerseNoteGroup,
  state: boolean,
) {
  noteGroups.notes?.map(note => (note.delete = state));
  noteGroups.delete = state;
  return saveChapter().pipe(
    map(() => {
      return resetLiveVerse(
        parseVerseNumfromVerseNoteID(verseNoteID),
        verseNoteID,
      ).pipe(
        map(() => {
          resetNotes$();
          store.updateVerses.next(true);
          store.updateNoteVisibility$.next(true);
        }),
      );
    }),
    flatMap(o => o),
  );
}

export function restoreNote(verseNoteID: string, noteGroups: VerseNoteGroup) {
  return setNoteDeletion(verseNoteID, noteGroups, false);
}
export function deleteNote(verseNoteID: string, noteGroups: VerseNoteGroup) {
  return setNoteDeletion(verseNoteID, noteGroups, true);

  // const note = verseNote?.notes?.find(note => note.id == noteID);
  // if (note) {
  //   note.delete = true;
  // }
  // const index = verseNote?.notes?.indexOf(note);
  // verseNote?.notes?.splice(index, 1);

  // resetNotes$();
  // console.log(
  //   chapter.verseNotes?.find(verseNote => verseNote.id === verseNoteID),
  // );
  // console.log(`${verseNoteID} ${noteID}`);
}
