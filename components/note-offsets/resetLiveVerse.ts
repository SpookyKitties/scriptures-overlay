import { EMPTY } from 'rxjs';
import { map, toArray, filter } from 'rxjs/operators';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import {
  expandNoteOffsets,
  resetVerse,
} from '../../oith-lib/src/shells/buildFMerged';
import { store } from '../SettingsComponent';

export function resetLiveVerse(verseid: string, noteID: string) {
  console.log(verseid);

  return store.chapter.pipe(
    filter(o => o !== undefined),
    map(chapter => {
      const verse = chapter.verses.find(v => v.id === verseid);

      const verseNote = chapter.verseNotes.find(v => v.id === noteID);
      if (verse) {
        return expandNoteOffsets(verseNote).pipe(
          toArray(),
          map(formatTags => resetVerse(verse, formatTags)),
          flatMap$,
        );
      }
      return EMPTY;
    }),
    flatMap$,
  );
}
