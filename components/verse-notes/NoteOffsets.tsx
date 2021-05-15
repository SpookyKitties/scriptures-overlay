import { Component } from 'react';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { clearOffsets } from './clearOffsets';

export class NoteOffsetsCompnent extends Component<{
  noteGroup: VerseNoteGroup;
  verseNodeID: string;
}> {
  render() {
    return this.props.noteGroup.notes[0].formatTag.offsets
      ?.split(',')
      .map(offsets => {
        return (
          <span className={`tag is-info is-small`}>
            {offsets}
            <a
              onClick={() => {
                clearOffsets(
                  this.props.noteGroup,
                  this.props.verseNodeID,
                  offsets,
                );
              }}
              className={'delete'}
            ></a>
          </span>
        );
      });
    return (
      <span className={`tag is-info is-small`}>
        {this.props.noteGroup.notes[0].formatTag.offsets}
        <a
          onClick={() => {
            clearOffsets(this.props.noteGroup, this.props.verseNodeID, '');
          }}
          className={'delete'}
        ></a>
      </span>
    );
  }
}
