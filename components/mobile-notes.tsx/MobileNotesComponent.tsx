import { flatten } from 'lodash';
import { Component, CSSProperties } from 'react';
import { BehaviorSubject } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { NoteRef, VerseNote } from '../../oith-lib/src/verse-notes/verse-note';
import {
  pronunciation,
  context,
  scriptures,
  jst,
  words,
} from '../note-category-icons.json';
import { appSettings, resetMobileNotes } from '../SettingsComponent';
import { VerseNoteGroupComponent } from '../verse-notes/VerseNoteGroupComponent';
import { renderCloseIcon } from './renderCloseIcon';
import { renderImageIcon } from './renderImageIcon';

export let syncedVerse: BehaviorSubject<VerseNote>;

export let updateVisibility: BehaviorSubject<boolean>;

export function renderJSTIcon(flatNotes?: NoteRef[]) {
  let className = `${!hasNote(jst, flatNotes) ? 'opaque-icons' : ''}`;

  return (
    <span style={iconStyle} className={`${className}`}>
      JST
    </span>
  );
}
export function renderWordsIcon(flatNotes?: NoteRef[]) {
  let className = `${!hasNote(words, flatNotes) ? 'opaque-icons' : ''}`;

  return (
    <span style={iconStyle} className={`${className}`}>
      🔠
    </span>
  );
}

export function renderScripturesIcon(flatNotes?: NoteRef[]) {
  let className = `${!hasNote(scriptures, flatNotes) ? 'opaque-icons' : ''}`;

  return (
    <span style={iconStyle} className={`${className}`}>
      📜
    </span>
  );

  return '';
}

export function renderContextIcon(flatNotes?: NoteRef[]) {
  let className = `${!hasNote(context, flatNotes) ? 'opaque-icons' : ''}`;

  return (
    <span style={iconStyle} className={`${className}`}>
      💡
    </span>
  );
}

export function hasNote(nums: number[], noteRefs?: NoteRef[]) {
  return noteRefs
    ? noteRefs.find((ref) => nums.includes(ref.category)) !== undefined
    : false;
}
export function renderPronunciationIcon(flatNotes?: NoteRef[]) {
  let className = `${!hasNote(pronunciation, flatNotes) ? 'opaque-icons' : ''}`;

  // console.log(className);

  return (
    <span style={iconStyle} className={`${className}`}>
      🔊
    </span>
  );
}

const noteComponentStyles: CSSProperties = {
  left: 0,
  width: '100vw',
  position: 'relative',
  backgroundColor: 'inherit',
  borderBottom: 'solid',
  borderBottomWidth: '1px',
  borderBottomColor: '#aeb6b6',
  height: '48px',
};

const notesComponentHeaderCSS: CSSProperties = {
  display: 'grid',
  width: '100vw',
  height: '48px',
  // gridAutoFlow: 'column',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  justifyContent: 'center',
  // maxWidth: 'calc(100vw - 48px)',
};

export const iconStyle: CSSProperties = {
  display: 'grid',
  justifyContent: 'center',
  alignContent: 'center',
  width: '40px',
  fontSize: '20px',
};

export class MobileNotesComponent extends Component {
  public state: {
    flatNotes?: NoteRef[];
    verseNote?: VerseNote;
  };

  private flattenNotes(verseNote?: VerseNote) {
    if (verseNote) {
      return flatten(
        verseNote.notes
          .filter((note) => note.formatTag.visible)
          .map((note) => note.ref.filter((ref) => ref.vis)),
      );
    }
    return [];
  }

  public componentDidMount() {
    syncedVerse = new BehaviorSubject(undefined);
    updateVisibility = new BehaviorSubject(true);
    updateVisibility
      .pipe(filter(() => this.state && this.state.verseNote !== undefined))
      .subscribe(() => {
        const verse = this.state.verseNote;
        this.setState({ verse: undefined });
        this.setState({ verseNote: verse });
      });
    syncedVerse.subscribe((verseNote) => {
      this.setState({ flatNotes: this.flattenNotes(verseNote) });
      this.setState({ verseNote: verseNote });
    });
  }
  private displayNotes() {
    appSettings.displayNotes();
    resetMobileNotes.next(true);
  }

  public render() {
    if (this.state && this.state.verseNote) {
    }
    return (
      <div style={noteComponentStyles} className={`note-component`}>
        <div
          style={notesComponentHeaderCSS}
          className={`notes-component-header`}
        >
          {renderWordsIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          {renderContextIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          {renderScripturesIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          {renderPronunciationIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          {renderJSTIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          {renderImageIcon(
            this.state && this.state.flatNotes
              ? this.state.flatNotes
              : undefined,
          )}
          <span
            className={`btn-close`}
            style={{ right: 0, alignSelf: 'center' }}
            onClick={() => this.displayNotes()}
          >
            {renderCloseIcon()}
          </span>
        </div>
      </div>
    );
  }
}
