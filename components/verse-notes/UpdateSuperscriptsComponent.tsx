import { Component } from 'react';
import { filter, map, flatMap } from 'rxjs/operators';
import { saveChapter } from '../note-offsets/saveChapter';
import { store } from '../SettingsComponent';
import { updateSuperscripts } from './updateSuperscripts';

export class UpdateSuperscriptsComponent extends Component {
  click() {
    return store.chapter
      .pipe(
        filter(o => o !== undefined),
        map(chapter => {
          return updateSuperscripts(chapter);
        }),
        flatMap(o => o),
        map(() => {
          return saveChapter();
        }),
        flatMap(o => o),
        map(() => {
          store.resetNotes$.next(true);
        }),
      )
      .toPromise();
    // parsePhraseText(this.props.verseNoteID, this.props.noteGroup);
  }
  render() {
    return (
      <div className={`btn-update-superscripts`}>
        <a onClick={() => this.click()} className={`button is-small `}>
          Update Superscripts
        </a>
      </div>
    );
  }
}
