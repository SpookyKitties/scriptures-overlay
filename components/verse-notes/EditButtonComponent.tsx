import { Component } from 'react';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { showNoteEditModal } from './NoteEditModalComponent';

export class EditButtonComponent extends Component<{
  noteGroup: VerseNoteGroup;
}> {
  click() {
    showNoteEditModal.next(true);
  }
  render() {
    return (
      <span className={'edit-button'} onClick={() => this.click()}>
        <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
          />
        </svg>
      </span>
    );
  }
}
