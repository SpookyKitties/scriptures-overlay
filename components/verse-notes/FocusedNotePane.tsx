import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  VerseNoteGroup,
  Note,
  NoteRef,
} from '../../oith-lib/src/verse-notes/verse-note';
import { VerseNoteGroupComponent } from './verse-notes-shell';
import { parseSubdomain } from '../parseSubdomain';
import { flatten } from 'lodash';
import { refClick } from './refClick';

export const openFocusNotePane = new BehaviorSubject<VerseNoteGroup>(undefined);
export class FocusedNotePane extends Component {
  public state: { verseNoteGroup?: VerseNoteGroup; refs?: NoteRef[] };

  componentDidMount() {
    openFocusNotePane.subscribe(vng => {
      console.log(vng);

      if (vng) {
        const refs = flatten(
          vng.notes.map(note =>
            note.ref.filter(ref => ref.moreStill && ref.vis),
          ),
        );
        this.setState({ refs: refs, verseNoteGroup: vng });
      } else {
        this.setState({ refs: undefined });
      }
    });
  }
  render() {
    if (this.state && this.state.refs) {
      return (
        <div id={'focusedNotePane'}>
          <div
            id={'closeFocusPane'}
            onClick={() => {
              openFocusNotePane.next(undefined);
            }}
          ></div>
          <div id={'focusedNotes'}>
            <div className={'verse-note'}>
              {this.state.refs.map(ref => {
                return (
                  <p
                    onClick={evt => {
                      if (
                        (evt.target as HTMLElement).classList.contains(
                          'ref-label',
                        )
                      ) {
                        refClick(this.state.verseNoteGroup, ref);
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

                        // if (elem) {
                        //   popupClick(elem);
                        // }
                      }}
                    ></span>
                    &nbsp;
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}
