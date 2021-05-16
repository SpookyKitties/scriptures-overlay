import { map } from 'rxjs/operators';
import { expandOffsets$ } from '../../oith-lib/src/offsets/expandOffsets';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { saveChapter } from '../note-offsets/saveChapter';
import { resetNotes$ } from '../resetNotes';
import { formatTagService, store } from '../SettingsComponent';
import { parseVerseNumfromVerseNoteID } from './parseVerseNumfromVerseNoteID';

function removeOffsets(removedOffsets: string, noteOffets?: string) {
  const offsets = noteOffets
    ?.split(',')
    .filter(off => off !== removedOffsets || off?.trim() === ',');

  return offsets?.join(',');
}

export function clearOffsets(
  noteGroup: VerseNoteGroup,
  verseNoteID: string,
  offsets: string,
) {
  if (noteGroup.notes) {
    if (noteGroup.formatTag.offsets !== undefined) {
      const newOffsets = removeOffsets(offsets, noteGroup.formatTag.offsets);
      console.log(newOffsets);

      // noteGroup.formatTag.offsets =
      noteGroup.offsets = newOffsets;
      noteGroup.formatTag.offsets = newOffsets;
      noteGroup.notes.map(note => {
        note.formatTag.offsets = newOffsets;
      });
    }
    // noteGroup.formatTag.offsets = '';

    // store.resetNotes$.next(true);
    // store.updateVerses.next(true);
    // store.updateFTags$.next(true);
    // formatTagService.reset();
    return expandOffsets$(noteGroup.formatTag)
      .pipe(
        map(() => {
          return saveChapter().pipe(
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
          );
        }),
        flatMap$,
      )
      .subscribe(o => {});
    // store.updateNoteVisibility$.next(true);
  }
}
