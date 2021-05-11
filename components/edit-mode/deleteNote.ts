import { flatMap, map } from 'rxjs/operators';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { saveChapter } from '../note-offsets/saveChapter';
import { resetNotes$ } from '../resetNotes';
import { store } from '../SettingsComponent';

export function deleteNote(
  verseNoteID: string,
  noteID: string,
  noteGroups: VerseNoteGroup,
) {
  return store.chapter.pipe(
    map(chapter => {
      const verseNote = chapter.verseNotes?.find(
        verseNote => verseNote.id === verseNoteID,
      );

      const note = verseNote?.notes?.find(note => note.id == noteID);
      if (note) {
        note.delete = true;
      }
      // const index = verseNote?.notes?.indexOf(note);
      // verseNote?.notes?.splice(index, 1);

      // return saveChapter();
      // resetNotes$();
      // console.log(
      //   chapter.verseNotes?.find(verseNote => verseNote.id === verseNoteID),
      // );
      // console.log(`${verseNoteID} ${noteID}`);
    }),
    // flatMap(o => o),
  );
}
