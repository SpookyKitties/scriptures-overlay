import { map } from 'rxjs/operators';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { saveChapter } from '../note-offsets/saveChapter';
import { formatTagService, store } from '../SettingsComponent';
import { parseVerseNumfromVerseNoteID } from './parseVerseNumfromVerseNoteID';

export function clearOffsets(noteGroup: VerseNoteGroup, verseNoteID: string) {
  if (noteGroup.notes) {
    noteGroup.formatTag.offsets = '';
    noteGroup.notes.map(note => {
      note.formatTag.offsets = '';
    });

    // store.resetNotes$.next(true);
    // store.updateVerses.next(true);
    // store.updateFTags$.next(true);
    // formatTagService.reset();
    saveChapter()
      .pipe(
        map(() => {
          return resetLiveVerse(
            parseVerseNumfromVerseNoteID(verseNoteID),
            verseNoteID,
          ).pipe(
            map(() => {
              store.updateVerses.next(true);
              store.updateNoteVisibility$.next(true);
            }),
          );
        }),
        flatMap$,
      )
      .subscribe(o => {});
    // store.updateNoteVisibility$.next(true);
  }
}
