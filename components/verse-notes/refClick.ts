import {
  NoteRef,
  VerseNoteGroup,
} from '../../oith-lib/src/verse-notes/verse-note';
import { parseSubdomain } from '../parseSubdomain';
export function refClick(noteGroup: VerseNoteGroup, ref: NoteRef) {
  console.log('ioajsdfiojasdiofj');
  if (
    ref.label.includes('🔊') &&
    noteGroup &&
    noteGroup.notes &&
    noteGroup.notes[0]
  ) {
    const phrase = noteGroup.notes[0].phrase
      .toLowerCase()
      .replace('“', '')
      .replace('”', '');
    const fileName = `${parseSubdomain().audioURL}${phrase}.wav`;

    try {
      new Audio(fileName).play();
    } catch (error) {}
  }
}
