import { EMPTY } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { buildVerseFMerged } from '../../oith-lib/src/shells/buildFMerged';
import { store } from '../SettingsComponent';

export function resetLiveVerse(verseid: string, noteID: string) {
  console.log(verseid);

  return store.chapter.pipe(
    filter((o) => o !== undefined),
    map((chapter) => {
      const verse = chapter.verses.find((v) => v.id === verseid);

      const verseNote = chapter.verseNotes.find((v) => v.id === noteID);
      if (verse) {
        (verse as any).testRandom = Math.random().toString(36).slice(2);

        return buildVerseFMerged(chapter, verse);
      }
      return EMPTY;
    }),
    flatMap((o) => o),
  );
}
