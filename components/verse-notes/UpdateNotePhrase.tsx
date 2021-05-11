import { Component } from 'react';
import {
  expandOffsets$,
  expandOffsets,
} from '../../oith-lib/src/offsets/expandOffsets';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { saveChapter } from '../note-offsets/saveChapter';
import { store } from '../SettingsComponent';
import { parseVerseNumfromVerseNoteID } from './parseVerseNumfromVerseNoteID';

function parsePhraseText(verseNoteID: string, verseNoteGroup: VerseNoteGroup) {
  const baseVerseID = parseVerseNumfromVerseNoteID(verseNoteID);

  const verseID = /^\d+$/.test(baseVerseID) ? `p${baseVerseID}` : baseVerseID;

  const verseText = document.querySelector(`#${verseID}`)?.textContent;
  const offsetsGroups = expandOffsets(verseNoteGroup.formatTag.offsets);

  console.log(offsetsGroups);

  const asdf = offsetsGroups
    .map(offsetsGroup => {
      return offsetsGroup.map(offset => verseText[offset]).join('');
    })
    .join(' ');
  verseNoteGroup.notePhrase = asdf;
  verseNoteGroup.notes.map(note => (note.phrase = asdf));
  saveChapter().subscribe(() => {
    store.resetNotes$.next(true);
  });

  // expandOffsets$(verseNoteGroup.formatTag).subscribe(o => {
  //   const asdf = o
  //     .map(v => {
  //       return verseText[v];
  //     })
  //     .join('');
  // });
}

export class UpdateNotePhrase extends Component<{
  noteGroup: VerseNoteGroup;
  verseNoteID: string;
}> {
  click() {
    parsePhraseText(this.props.verseNoteID, this.props.noteGroup);
  }
  render() {
    return (
      <a onClick={() => this.click()} className={`button is-small`}>
        Update Phrase
      </a>
    );
  }
}
