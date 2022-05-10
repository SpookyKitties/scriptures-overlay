import { sortBy } from 'lodash';
import { Chapter } from '../../oith-lib/src/models/Chapter';

export async function updateSuperscripts(chapter: Chapter) {
  return;
  chapter.verseNotes?.map(verseNote => {
    return sortBy(
      verseNote.noteGroups?.filter(noteGroup => !noteGroup.delete),
      ng => ng.formatTag.uncompressedOffsets[0],
    ).map((noteGroup, i) => {
      // console.log(`${i + 1} to ${String.fromCharCode(i + 65).toLowerCase()}`);
      const offsets = noteGroup.formatTag.offsets;

      if (offsets !== '' && offsets !== undefined) {
        noteGroup.sup = String.fromCharCode(i + 65).toLowerCase();
        noteGroup.notes?.map(note => (note.sup = noteGroup.sup));
      } else {
        noteGroup.sup = undefined;
        noteGroup.notes?.map(note => (note.sup = undefined));
        i = i - 1;
      }
    });
  });
}
