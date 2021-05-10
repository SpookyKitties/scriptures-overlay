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
import { deleteNote } from '../edit-mode/deleteNote';

export const openFocusNotePane = new BehaviorSubject<VerseNoteGroup>(undefined);

export function displayState<T, T2 extends keyof T>(state: T, key: T2) {
  return state && state[key] ? state[key] : '';
}
export class FocusedNotePane extends Component {
  public state: {
    verseNoteGroup?: VerseNoteGroup;
    refs?: NoteRef[];
    sup?: string;
    num?: string;
  };

  componentDidMount() {
    openFocusNotePane.subscribe(vng => {
      console.log(vng);

      if (vng) {
        const refs = flatten(
          vng.notes.map(note => note.ref.filter(ref => !ref.more && ref.vis)),
        );
        console.log(vng);

        this.setState({
          refs: refs,
          verseNoteGroup: vng,
          sup: vng.sup,
          num: vng.num,
        });
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
            <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr' }}>
              <div
                style={{
                  display: 'block',
                  listStyle: 'none',
                  marginLeft: '20px',
                  lineHeight: '22.5px',
                  fontSize: '0.83em',
                  marginTop: '5px',
                }}
              >
                {displayState(this.state, 'num')}
                {displayState(this.state, 'sup')}
              </div>
              <div className={'verse-note'}>
                {this.state.refs.map(ref => {
                  return (
                    <p
                      onClick={async evt => {
                        if (
                          (evt.target as HTMLElement).classList.contains(
                            'ref-label',
                          )
                        ) {
                          console.log('ioajsdfiojasdiofj');

                          refClick(this.state.verseNoteGroup, ref);
                        }
                      }}
                      className={`note-reference ${ref.label
                        .trim()
                        .replace('🔊', 'speaker')} ${ref.vis ? '' : 'none'}`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ref.text.replace(/\#/g, ''),
                        }}
                        onClick={evt => {
                          const elem = evt.target as HTMLElement;

                          console.log('ioasjdfiojiasdofj');

                          // if (elem) {
                          //   popupClick(elem);
                          // }
                        }}
                      ></span>
                      {/* &nbsp; */}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}
