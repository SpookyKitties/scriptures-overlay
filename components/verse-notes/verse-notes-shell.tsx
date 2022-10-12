import { delay, flatten, map, sortBy, uniqBy } from 'lodash';
import { Component } from 'react';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import {
  Note,
  NoteRef,
  VerseNote,
  VerseNoteGroup,
} from '../../oith-lib/src/verse-notes/verse-note';
import { store, appSettings, resetMobileNotes } from '../SettingsComponent';
import { MobileNotesComponent } from '../mobile-notes.tsx/MobileNotesComponent';
import { parseSubdomain } from '../parseSubdomain';

type VNProps = {
  chapter?: Chapter;
  // verseNotes?: VerseNote[];
};

export function popupClick(elem: HTMLElement) {
  if (elem.getAttribute('url') === 'pronunciation-key.html') {
    noteModal.next('pronunciation');
  }
}
function createMarkup(txt: string) {
  return { __html: txt };
}

function sortNotes(noteA: Note, noteB: Note) {
  return noteA.noteType - noteB.noteType;
}

export function sortNoteRefs(noteRefA: NoteRef, noteRefB: NoteRef) {
  return noteRefA.category - noteRefB.category;
}

class NoteGroupComponent extends Component {
  componentDidMount() {
    store.editMode$.subscribe((o) => {
      this.setState({ editMode: o });
    });
  }
  render() {
    return '';
  }
}

export const sortFilterNoteRefs = (
  verseNoteGroup: VerseNoteGroup,
  soglo?: boolean,
) => {
  if (soglo) {
    return flatten(
      verseNoteGroup.notes
        .filter((nt) => nt.formatTag.visible)
        .map((nt) => refFilter(verseNoteGroup, nt.ref)),
    ).filter((nr) => !nr.delete);
  }
  return flatten(
    uniqBy(
      verseNoteGroup.notes.filter((nt) => nt.formatTag.visible),
      (n) => n.id,
    ).map((nt) => nt.ref),
  ).filter((nr) => !nr.delete);
};

const refFilter = (verseNoteGroup: VerseNoteGroup, noteRefs: NoteRef[]) => {
  if (verseNoteGroup.hasMoreStill && verseNoteGroup.showMoreStill) {
    return noteRefs.filter((noteRef) => noteRef.vis && !noteRef.more);
  }

  return noteRefs.filter((noteRef) => noteRef.vis && !noteRef.moreStill);
};

function getSup(note: { lSup?: string; sup?: string }) {
  if (note.sup) {
    return note.sup;
  }
  if (note.lSup) {
    return note.lSup;
  }
  return '-';
}

function newSortVerseNoteGroups(verseNoteGroup: VerseNoteGroup) {
  if (verseNoteGroup.formatTag.offsets === 'all') {
    return -1;
  }
  return verseNoteGroup.formatTag &&
    verseNoteGroup.formatTag.uncompressedOffsets
    ? verseNoteGroup.formatTag.uncompressedOffsets[0]
    : 0;
}

function sortVerseNoteGroups(
  verseNoteGroupA: VerseNoteGroup,
  verseNoteGroupB: VerseNoteGroup,
) {
  // if (parseSubdomain().soglo) {
  //   return (
  //     getSup(verseNoteGroupA).charCodeAt(0) -
  //     65 -
  //     (getSup(verseNoteGroupB).charCodeAt(0) - 65)
  //   );
  // }

  const getFirstOffset = (vng: VerseNoteGroup) => {
    if (vng.formatTag.offsets === 'all') {
      return -1;
    }
    return vng.formatTag && vng.formatTag.uncompressedOffsets
      ? vng.formatTag.uncompressedOffsets[0]
      : 0;
  };

  console.log(
    `${getFirstOffset(verseNoteGroupA)} ${getFirstOffset(verseNoteGroupB)}`,
  );

  return getFirstOffset(verseNoteGroupA) - getFirstOffset(verseNoteGroupB);
}

type VerseNoteState = { verseNote: VerseNote };

export class VerseNoteComponent extends Component<VerseNoteState> {
  public state: VerseNoteState;

  componentDidMount() {
    store.updateNoteVisibility$.subscribe((t) => {
      console.log(this.props.verseNote);

      this.setState({ verseNote: this.props.verseNote });
    });
  }
  // componentDidUpdate(
  //   prevProps: Readonly<VerseNoteState>,
  //   prevState: Readonly<{}>,
  //   snapshot?: any,
  // ): void {
  //   this.setState({ verseNote: this.props.verseNote });
  //   // this.forceUpdate();
  // }

  // shouldComponentUpdate(
  //   nextProps: Readonly<VerseNoteState>,
  //   nextState: Readonly<{}>,
  //   nextContext: any,
  // ): boolean {
  //   // (nextProps);

  //   if (this.state?.verseNote !== nextProps.verseNote) {
  //     return true;
  //   }
  //   return false;
  // }

  public render() {
    if (this.props.verseNote) {
      const sg = parseSubdomain().soglo;
      const verseNote = this.props.verseNote;
      if (verseNote.noteGroups) {
        const shortTitle = generateShortTitle(verseNote);
        return (
          <div
            className={`verse-note ${sg ? 'soglo' : ''} ${shortTitle
              .replace(/\s/g, '')
              .toLowerCase()} ${verseNote.vis ? '' : 'none'}`}
            id={verseNote.id}
          >
            <p className="short-title">{shortTitle}</p>
            {sortBy(verseNote.noteGroups, (vng) =>
              newSortVerseNoteGroups(vng),
            ).map((noteGroup) => (
              <VerseNoteGroupComponent
                noteGroup={noteGroup}
                soglo={sg}
                verseNoteID={verseNote.id}
              />
            ))}
          </div>
        );
      }
    }
    return <></>;
  }
}

import * as viewport from 'viewport-dimensions';
import { noteModal } from './note-modal';
import { FocusedNotePane } from './FocusedNotePane';
import { deleteNote } from '../edit-mode/deleteNote';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { resetLiveVerse } from '../note-offsets/resetLiveVerse';
import { UpdateNotePhrase } from './UpdateNotePhrase';
import { UpdateSuperscriptsComponent } from './UpdateSuperscriptsComponent';
import { filter, map as rxjsMap } from 'rxjs';
import { delay as delayRxjs } from 'rxjs/operators';
import { VerseNoteGroupComponent } from './VerseNoteGroupComponent';
export class VerseNotesShellComponent extends Component<VNProps> {
  public state: { chapter: Chapter; verseNotesHeight: string };

  componentDidMount() {
    resetMobileNotes.subscribe(() => {
      this.setMobileGridStyle();
    });
    store.chapter
      .pipe(
        filter((o) => o !== undefined),
        rxjsMap((chapter) => {
          this.setState({ chapter: chapter }, () => {
            // this.forceUpdate();
          });
          return chapter;
        }),
        // delayRxjs(100),
      )

      .subscribe((chapter) => {
        // this.forceUpdate();
      });
  }

  setMobileGridStyle() {
    try {
      if (window && window.matchMedia(`(max-width: 500px)`).matches) {
        let verseNotesHeight = `48px`;
        if (appSettings.settings.notesMode === 'small') {
          verseNotesHeight = `calc((${viewport.height()}px - 48px)  * .3 )`;
        }
        if (appSettings.settings.notesMode === 'large') {
          verseNotesHeight = `calc((${viewport.height()}px - 48px)  * .4 )`;
        }

        this.setState({ verseNotesHeight: verseNotesHeight });
      } else {
        this.setState({ verseNotesHeight: undefined, mobileStyle: undefined });
      }
    } catch (error) {
      this.setState({ verseNotesHeight: undefined, mobileStyle: undefined });
    }
  }

  renderFuture() {
    if (parseSubdomain().beta) {
      return <MobileNotesComponent />;
    }
    return <></>;
  }
  render() {
    if (this.state?.chapter) {
      return (
        <div
          className={`note-pane`}
          style={{
            height:
              this.state && this.state.verseNotesHeight
                ? this.state.verseNotesHeight
                : 'initial',
            bottom: 0,
          }}
        >
          {this.renderFuture()}
          <div className="verse-notes">
            {this.state.chapter.verses.map((verse) => {
              const verseNote = this.state.chapter.verseNotes?.find((vN) =>
                vN.id.includes(`-${verse.id}-verse-notes`),
              );
              if (verseNote) {
                return <VerseNoteComponent verseNote={verseNote} />;
              }
            })}
            <div className="white-space"></div>
          </div>
          {/* <UpdateSuperscriptsComponent></UpdateSuperscriptsComponent> */}
          <UpdateNotePhrase></UpdateNotePhrase>
        </div>
      );
    }

    return <div className="verse-notes"></div>;
  }
}

function generateShortTitle(verseNote: VerseNote) {
  if (verseNote) {
    if (
      doesntInclude(['title1', 'closing1', 'intro1', 'number1'], verseNote.id)
    ) {
      const idSplit = verseNote.id.split('-');

      return `Verse ${idSplit[idSplit.length - 3]} Notes`;
    } else if (
      verseNote.id.includes('title1') ||
      verseNote.id.includes('intro1') ||
      verseNote.id.includes('title_number') ||
      verseNote.id.includes('title_number1')
    ) {
      return 'Chapter Notes';
    } else if (verseNote.id.includes('closing')) {
      return 'Footer Notes';
    }
  }
  return '';
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function doesntInclude(strings: string[], val: string) {
  return strings.filter((s) => val.includes(s)).length === 0;
}
