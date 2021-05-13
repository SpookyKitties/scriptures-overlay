import { Chapter } from '../../oith-lib/src/models/Chapter';

export async function updateSuperscripts(chapter: Chapter) {
  chapter.verseNotes?.map(verseNote => {
    return verseNote.noteGroups
      ?.filter(noteGroup => !noteGroup.delete)
      .sort(ng => ng.formatTag.uncompressedOffsets[0])
      .map((noteGroup, i) => {
        // console.log(`${i + 1} to ${String.fromCharCode(i + 65).toLowerCase()}`);
        const offsets = noteGroup.formatTag.offsets;
        console.log(offsets);

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
