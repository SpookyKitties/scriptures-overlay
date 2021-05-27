import { Chapter } from '../../oith-lib/src/models/Chapter';
import { of } from 'rxjs';
export function addNotesToVerses$(chapter: Chapter) {
  const addNotesToVerses = () => {
    chapter.verses.map(verse => {
      const verseNote = chapter.verseNotes?.find(verseNote =>
        verseNote.id.includes(`-${verse.id}-verse-notes`),
      );
      verse.verseNote = verseNote;
    });
  };
  return of(addNotesToVerses());
}
