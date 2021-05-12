import { flatten } from 'lodash';
import { Component } from 'react';
import { filter, map, flatMap } from 'rxjs/operators';
import { Chapter } from '../../oith-lib/src/models/Chapter';
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

  const asdf = offsetsGroups
    .map(offsetsGroup => {
      return offsetsGroup.map(offset => verseText[offset]).join('');
    })
    .join(' ');
  if (asdf.trim() !== '') {
    verseNoteGroup.notePhrase = asdf;
    verseNoteGroup.notes.map(note => (note.phrase = asdf));
  } else {
  }
  // saveChapter().subscribe(() => {
  //   store.resetNotes$.next(true);
  // });

  // expandOffsets$(verseNoteGroup.formatTag).subscribe(o => {
  //   const asdf = o
  //     .map(v => {
  //       return verseText[v];
  //     })
  //     .join('');
  // });
}

async function setNotePhrases(chapter: Chapter) {
  chapter.verseNotes?.map(verseNote =>
    verseNote.noteGroups?.map(noteGroup => {
      return parsePhraseText(verseNote.id, noteGroup);
    }),
  );
}

export class UpdateNotePhrase extends Component {
  click() {
    store.chapter
      .pipe(
        filter(o => o !== undefined),
        map(chapter => {
          return setNotePhrases(chapter);
        }),
        flatMap(o => o),
        map(() => {
          return saveChapter();
        }),
        flatMap(o => o),
      )
      .subscribe(() => {
        store.resetNotes$.next(true);
      });
    // parsePhraseText(this.props.verseNoteID, this.props.noteGroup);
  }
  render() {
    return (
      <div className={`btn-update-phrase`}>
        <a onClick={() => this.click()} className={`button is-small `}>
          Update Phrase
        </a>
      </div>
    );
  }
}
