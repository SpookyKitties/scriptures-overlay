import { flatMap, map } from 'rxjs/operators';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { saveChapter } from '../note-offsets/saveChapter';
import { resetNotes$ } from '../resetNotes';
import { store } from '../SettingsComponent';
import { parseVerseNumfromVerseNoteID } from '../verse-notes/parseVerseNumfromVerseNoteID';

export function deleteNote(verseNoteID: string, noteGroups: VerseNoteGroup) {
  noteGroups.notes?.map(note => (note.delete = true));
  noteGroups.delete = true;

  // const note = verseNote?.notes?.find(note => note.id == noteID);
  // if (note) {
  //   note.delete = true;
  // }
  // const index = verseNote?.notes?.indexOf(note);
  // verseNote?.notes?.splice(index, 1);

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
  // resetNotes$();
  // console.log(
  //   chapter.verseNotes?.find(verseNote => verseNote.id === verseNoteID),
  // );
  // console.log(`${verseNoteID} ${noteID}`);
}
