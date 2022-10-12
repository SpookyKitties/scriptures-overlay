import { Component, MouseEvent, CSSProperties } from 'react';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { gotoLink } from '../gotoLink';
import { notePhraseClick } from './notePhraseClick';
import { refClick } from './refClick';
import { parseSubdomain } from '../parseSubdomain';
import { openFocusNotePane } from './FocusedNotePane';
import { EditModeComponent } from './EditModeComponent';
import { DeleteNoteComponent } from './DeleteNoteComponent';
import { EditButtonComponent } from './EditButtonComponent';
import {
  sortFilterNoteRefs,
  sortNoteRefs,
  popupClick,
} from './verse-notes-shell';

export class VerseNoteGroupComponent extends Component<{
  noteGroup: VerseNoteGroup;
  soglo: boolean;
  verseNoteID: string;
}> {
  render() {
    return (
      <div
        className={`verse-note-group  delete-${
          this.props.noteGroup.notes[0].delete
        } ${this.props.noteGroup.id} ${
          this.props.noteGroup.media ? 'soglo-media' : ''
        } ${this.props.soglo ? 'soglo' : ''} ${
          this.props.noteGroup.formatTag.visible ? '' : 'none'
        }   ${this.props.noteGroup.formatTag.highlight ? 'highlight' : ''}`}
      >
        {/* <span
                  className={`soglo-num ${this.props.noteGroup.numVisible ? '' : ''}`}
                >
                  {this.props.noteGroup.num
                    ?.replace('title1', '')
                    .replace('sub', '')
                    .replace(/intro.+/g, '')}
                  {this.props.noteGroup.sup}{' '}
                </span> */}
        <span
          onClick={(evt: MouseEvent) => {
            const ee = evt.target as HTMLElement;
            notePhraseClick(ee, this.props.noteGroup.formatTag);
          }}
          className={`note-phrase`}
          style={this.displayOnSoglo(
            this.props.soglo == false,
            this.props.noteGroup,
          )}
        >
          <span
            className={`soglo-num ${this.props.noteGroup.numVisible ? '' : ''}`}
          >
            {this.props.noteGroup.num
              ?.replace('title1', '')
              .replace('sub', '')
              .replace(/intro.+/g, '')}
            {this.props.noteGroup.sup}{' '}
          </span>
          <span
            className={`note-phrase-text`}
            dangerouslySetInnerHTML={{
              __html: this.props.noteGroup.notes[0]?.phrase,
            }}
          ></span>
        </span>
        <DeleteNoteComponent
          noteGroup={this.props.noteGroup}
          verseNoteID={this.props.verseNoteID}
        ></DeleteNoteComponent>
        <EditButtonComponent
          noteGroup={this.props.noteGroup}
        ></EditButtonComponent>
        <span
          style={this.displayOnSoglo(this.props.soglo, this.props.noteGroup)}
        >
          <span
            className={`soglo-num ${
              this.props.noteGroup.numVisible ? '' : 'none'
            }`}
          >
            {this.props.noteGroup.num?.replace('title1', '')}
            {this.props.noteGroup.sup}
          </span>
        </span>
        <div
          className={`note`}
          style={{ width: '84%' }}
          onClick={(event) => {
            gotoLink(event);
          }}
        >
          {sortFilterNoteRefs(this.props.noteGroup, this.props.soglo)
            .sort((a, b) => (parseSubdomain().soglo ? 1 : sortNoteRefs(a, b)))
            .map((ref) => {
              return (
                <p
                  onClick={(evt) => {
                    if (
                      (evt.target as HTMLElement).classList.contains(
                        'ref-label',
                      )
                    ) {
                      refClick(this.props.noteGroup, ref);
                    }
                  }}
                  className={`note-reference delete-${ref.delete} ${ref.label
                    .trim()
                    .replace('🔊', 'speaker')} ${ref.vis ? '' : 'none'}`}
                >
                  {/* <textarea name="" id="" cols={30} rows={10}>
                              {ref.text.replace(/\#/g, '')}
                            </textarea> */}
                  {/* <span className="ref-label">{ref.label}</span> */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ref.text.replace(/\#/g, ''),
                    }}
                    onClick={(evt) => {
                      const elem = evt.target as HTMLElement;

                      // ref.delete = true;
                      // store.updateNoteVisibility$.next(true);
                      // store.updateFTags$.next(true);
                      // saveChapter();
                      // try {
                      //   deleteNote(
                      //     this.props.verseNoteID,
                      //     this.props.noteGroup.notes[0].id,
                      //     this.props.noteGroup,
                      //   ).subscribe(() => {
                      //     // store.resetNotes$.next(true);
                      //     // formatTagService.reset();
                      //     store.updateNoteVisibility$.next(true);
                      //   });
                      // } catch (error) {
                      // }
                      if (elem) {
                        popupClick(elem);
                      }
                    }}
                  ></span>
                  {/* &nbsp; */}
                </p>
              );
            })}
          <EditModeComponent
            noteGroup={this.props.noteGroup}
            verseNoteID={this.props.verseNoteID}
          ></EditModeComponent>
          <div
            style={{
              color: '#177c9c',
              textDecoration: 'none',
              textAlign: 'center',
              marginRight: '10px',
              marginTop: '-10px',
            }}
            className={`${
              this.props.noteGroup.hasMoreStill &&
              this.props.noteGroup.formatTag.visible &&
              !this.props.noteGroup.showMoreStill
                ? ''
                : 'none'
            }`}
            onClick={() => {
              this.showMore(true, this.props.noteGroup);
            }}
          >
            Show More
          </div>
          <div
            onClick={() => {
              this.showMore(false);
            }}
            style={{
              color: '#177c9c',
              textDecoration: 'none',
              textAlign: 'center',
              marginRight: '10px',
            }}
            className={`${
              this.props.noteGroup.hasMoreStill &&
              this.props.noteGroup.formatTag.visible &&
              this.props.noteGroup.showMoreStill
                ? ''
                : 'none'
            }`}
          >
            Hide More
          </div>
        </div>
      </div>
    );
  }

  private showMore(showMore: boolean, verseNoteGroup?: VerseNoteGroup) {
    // this.props.noteGroup.showMoreStill = showMore;
    openFocusNotePane.next(showMore ? verseNoteGroup : undefined);
    // store.updateNoteVisibility$.next(true);
  }

  private displayOnSoglo(
    sg: boolean,
    noteGroup: VerseNoteGroup,
  ): CSSProperties {
    const vis = noteGroup.formatTag.visible;
    return { display: `${sg && vis ? 'block' : 'none'}` };
  }
}
