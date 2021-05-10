import { flatMap, map } from 'rxjs/operators';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { saveChapter } from '../note-offsets/saveChapter';
import { resetNotes$ } from '../resetNotes';
import { store } from '../SettingsComponent';

export function deleteNote(verseNoteID: string, noteID: string) {
  return store.chapter.pipe(
    map(chapter => {
      const verseNote = chapter.verseNotes?.find(
        verseNote => verseNote.id === verseNoteID,
      );

      const note = verseNote?.notes?.find(note => note.id == noteID);
      const index = verseNote?.notes?.indexOf(note);
      verseNote?.notes?.splice(index, 1);

      console.log(note);
      return saveChapter();
      // resetNotes$();
      // console.log(
      //   chapter.verseNotes?.find(verseNote => verseNote.id === verseNoteID),
      // );
      // console.log(`${verseNoteID} ${noteID}`);
    }),
    flatMap(o => o),
    map(() => {
      resetNotes$();
    }),
  );
}
