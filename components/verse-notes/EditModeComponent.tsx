import { Component } from 'react';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { NoteOffsetsCompnent } from './NoteOffsets';
import { UpdateNotePhrase } from './UpdateNotePhrase';

export class EditModeComponent extends Component<{
  noteGroup: VerseNoteGroup;
  verseNoteID: string;
}> {
  render() {
    return (
      <div
        className={`edit-mode-offsets ${
          this.props.noteGroup.notes[0].formatTag.offsets &&
          this.props.noteGroup.notes[0].formatTag.offsets.length === 0
            ? 'none'
            : ''
        }`}
      >
        <NoteOffsetsCompnent
          noteGroup={this.props.noteGroup}
          verseNodeID={this.props.verseNoteID}
        ></NoteOffsetsCompnent>
        <br />
        <UpdateNotePhrase
          noteGroup={this.props.noteGroup}
          verseNoteID={this.props.verseNoteID}
        ></UpdateNotePhrase>
      </div>
    );
  }
}
