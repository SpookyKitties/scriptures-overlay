import { Component } from 'react';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { deleteNote, restoreNote } from '../edit-mode/deleteNote';

export class DeleteNoteComponent extends Component<{
  noteGroup: VerseNoteGroup;
  verseNoteID: string;
}> {
  click() {
    if (this.props.noteGroup.delete) {
      restoreNote(this.props.verseNoteID, this.props.noteGroup).subscribe();
    } else {
      deleteNote(this.props.verseNoteID, this.props.noteGroup).subscribe();
    }
  }
  render() {
    return (
      <label className={'checkbox show-edit-mode'}>
        <input
          onChange={() => this.click()}
          type="checkbox"
          checked={!this.props.noteGroup.delete}
        />
      </label>
    );
  }
}

// <a
//   onClick={() => this.click()}
//   className={'delete is-small show-edit-mode'}
//   style={{ position: 'absolute', right: '10px', top: '10px' }}
// ></a>
