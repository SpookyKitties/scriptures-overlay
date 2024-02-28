import { Dictionary, groupBy as _groupBy } from 'lodash';
import { parseSubdomain } from '../../../components/parseSubdomain';
import { Note, VerseNote, VerseNoteGroup } from '../verse-notes/verse-note';
import { getSup, hasMoreStillNotes } from './build-shells';

export function generateVerseNoteGroup(vN: VerseNote) {
  if (vN.notes) {
    let sortedNotes: Dictionary<Note[]>;
    if (parseSubdomain().soglo) {
      sortedNotes = _groupBy(vN.notes, (note) => {
        if (
          note.formatTag.offsets === '' ||
          note.formatTag.offsets === undefined
        ) {
          return note.id;
        }

        return `${getSup(note)}-${note.formatTag.offsets}`;
      });

      vN.noteGroups = Array.from(Object.keys(sortedNotes)).map((key) => {
        const notes = sortedNotes[key];

        const firstNoteWithASup =
          notes.length > 0 ? notes.find((n) => n.sup !== undefined) : undefined;

        const sup = firstNoteWithASup ? firstNoteWithASup.sup : '';
        const lSup =
          notes.length > 0 && notes[0].lSup !== undefined ? notes[0].lSup : '';

        return new VerseNoteGroup(
          notes,
          '',
          sup,
          lSup,
          hasMoreStillNotes(notes),
        );
      });
    } else {
      sortedNotes = _groupBy(vN.notes, (note) => {
        if (
          note.formatTag.offsets === '' ||
          note.formatTag.offsets === undefined
        ) {
          return note.id;
        }

        return note.formatTag.offsets;
      });

      vN.noteGroups = Array.from(Object.keys(sortedNotes)).map((key) => {
        const notes = sortedNotes[key].sort((a, b) => a.noteType - b.noteType);
        const sup =
          notes.length > 0 && notes[0].sup !== undefined ? notes[0].sup : '';

        return new VerseNoteGroup(notes, '', sup);
      });
    }
  }
}
