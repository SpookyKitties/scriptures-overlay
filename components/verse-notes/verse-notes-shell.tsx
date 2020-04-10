import { flatten, uniqBy } from 'lodash';
import { Component, MouseEvent, CSSProperties } from 'react';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import {
  Note,
  NoteRef,
  VerseNote,
  VerseNoteGroup,
} from '../../oith-lib/src/verse-notes/verse-note';
import { gotoLink } from '../gotoLink';
import { saveChapter } from '../note-offsets/saveChapter';
import {
  formatTagService,
  store,
  appSettings,
  resetMobileNotes,
} from '../SettingsComponent';
import { notePhraseClick } from './notePhraseClick';
import { refClick } from './refClick';
import { MobileNotesComponent } from '../mobile-notes.tsx/MobileNotesComponent';
import { parseSubdomain } from '../parseSubdomain';

type VNProps = {
  chapter?: Chapter;
  // verseNotes?: VerseNote[];
};

function popupClick(elem: HTMLElement) {
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

function sortNoteRefs(noteRefA: NoteRef, noteRefB: NoteRef) {
  return noteRefA.category - noteRefB.category;
}

class NoteGroupComponent extends Component {
  componentDidMount() {
    store.editMode$.subscribe(o => {
      this.setState({ editMode: o });
    });
  }
  render() {
    return '';
  }
}

function clearOffsets(noteGroup: VerseNoteGroup) {
  if (noteGroup.notes) {
    noteGroup.formatTag.offsets = '';
    noteGroup.notes.map(note => {
      note.formatTag.offsets = '';
    });

    store.resetNotes$.next(true);
    formatTagService.reset();

    saveChapter().subscribe();
  }
}
export class VerseNoteGroupComponent extends Component<{
  noteGroup: VerseNoteGroup;
  soglo: boolean;
}> {
  render() {
    return (
      <div
        className={`verse-note-group ${
          this.props.noteGroup.media ? 'soglo-media' : ''
        } ${this.props.soglo ? 'soglo' : ''} ${
          this.props.noteGroup.formatTag.visible ? '' : 'none'
        }   ${this.props.noteGroup.formatTag.highlight ? 'highlight' : ''}`}
      >
        <span
          onClick={(evt: MouseEvent) => {
            const ee = evt.target as HTMLElement;
            notePhraseClick(ee, this.props.noteGroup.formatTag);
          }}
          className="note-phrase"
          style={this.displayOnSoglo(
            this.props.soglo == false,
            this.props.noteGroup,
          )}
        >
          {this.props.noteGroup.notes[0].phrase}
        </span>
        <span
          style={this.displayOnSoglo(this.props.soglo, this.props.noteGroup)}
        >
          {this.props.noteGroup.num}
          {this.props.noteGroup.sup}
        </span>
        <div
          className={`note`}
          onClick={event => {
            gotoLink(event);
          }}
        >
          {flatten(
            uniqBy(
              this.props.noteGroup.notes.filter(nt => nt.formatTag.visible),
              n => n.id,
            ).map(nt => nt.ref.filter(ref => ref.vis)),
          )
            .sort((a, b) => sortNoteRefs(a, b))
            .map(ref => {
              return (
                <p
                  onClick={evt => {
                    if (
                      (evt.target as HTMLElement).classList.contains(
                        'ref-label',
                      )
                    ) {
                      refClick(this.props.noteGroup, ref);
                    }
                  }}
                  className={`note-reference ${ref.label
                    .trim()
                    .replace('🔊', 'speaker')} ${ref.vis ? '' : 'none'}`}
                >
                  <span className="ref-label">{ref.label}</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ref.text.replace(/\#/g, ''),
                    }}
                    onClick={evt => {
                      const elem = evt.target as HTMLElement;

                      if (elem) {
                        popupClick(elem);
                      }

                      console.log(elem);
                    }}
                  ></span>
                  &nbsp;
                </p>
              );
            })}
          <div
            className={`edit-mode-offsets ${
              this.props.noteGroup.notes[0].formatTag.offsets &&
              this.props.noteGroup.notes[0].formatTag.offsets.length === 0
                ? 'none'
                : ''
            }`}
          >
            <span className={`tag is-info is-small`}>
              {this.props.noteGroup.notes[0].formatTag.offsets}
              <a
                onClick={() => {
                  clearOffsets(this.props.noteGroup);
                }}
                className={'delete'}
              ></a>
            </span>
          </div>
        </div>
      </div>
    );
  }

  private displayOnSoglo(
    sg: boolean,
    noteGroup: VerseNoteGroup,
  ): CSSProperties {
    const vis = noteGroup.formatTag.visible;
    return { display: `${sg && vis ? 'initial' : 'none'}` };
  }
}

function sortVerseNoteGroups(
  verseNoteGroupA: VerseNoteGroup,
  verseNoteGroupB: VerseNoteGroup,
) {
  if (parseSubdomain().soglo) {
    return ( verseNoteGroupA.sup.charCodeAt(0)-65) - (verseNoteGroupB.sup.charCodeAt(0) - 65);
  }
  const getFirstOffset = (vng: VerseNoteGroup) => {
    if (vng.formatTag.offsets === 'all') {
      return -1;
    }
    return vng.formatTag && vng.formatTag.uncompressedOffsets
      ? vng.formatTag.uncompressedOffsets[0]
      : 0;
  };

  return getFirstOffset(verseNoteGroupA) - getFirstOffset(verseNoteGroupB);
}

type VerseNoteState = { verseNote: VerseNote };

export class VerseNoteComponent extends Component<VerseNoteState> {
  public state: VerseNoteState;

  componentDidMount() {
    store.updateNoteVisibility$.subscribe(() => {
      this.setState({ verseNote: this.props.verseNote });
    });
  }
  public render() {
    if (this.state && this.state.verseNote) {
      const sg = parseSubdomain().soglo;
      const verseNote = this.state.verseNote;
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
            {verseNote.noteGroups
              .sort((a, b) => sortVerseNoteGroups(a, b))
              .map(noteGroup => (
                <VerseNoteGroupComponent noteGroup={noteGroup} soglo={sg} />
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
export class VerseNotesShellComponent extends Component<VNProps> {
  public state: { chapter: Chapter; verseNotesHeight: string };

  componentDidMount() {
    resetMobileNotes.subscribe(() => {
      this.setMobileGridStyle();
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
    if (this.props.chapter) {
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
            {this.props.chapter.verses.map(verse => {
              const verseNote = this.props.chapter.verseNotes.find(vN =>
                vN.id.includes(`-${verse.id}-verse-notes`),
              );
              if (verseNote) {
                return <VerseNoteComponent verseNote={verseNote} />;
              }
            })}
            <div className="white-space"></div>
          </div>
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
  return strings.filter(s => val.includes(s)).length === 0;
}
