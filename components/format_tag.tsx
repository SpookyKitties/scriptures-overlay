import { flatten, uniq } from 'lodash';
import { Component, CSSProperties } from 'react';
import { forkJoin, of } from 'rxjs';
import { delay, filter, map, take } from 'rxjs/operators';
import { FormatMerged } from '../oith-lib/src/models/Chapter';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import {
  FormatTagNoteOffsets,
  VerseNote,
  Note,
} from '../oith-lib/src/verse-notes/verse-note';
import { parseSubdomain } from './parseSubdomain';
import {
  appSettings,
  formatTagService,
  store,
  resetMobileNotes,
} from './SettingsComponent';

export function displayStateKey<T, T2 extends keyof T>(state: T, key: T2) {
  return state ? state[key] : '';
}

export function calcClassList(formatMerged: FormatMerged) {
  const fts = formatMerged.formatTags.filter(f => {
    return [55, 56].includes(f.fType) && f.visible;
  });

  const all = fts.find(
    ft =>
      ft.offsets === 'all' ||
      (ft.uncompressedOffsets && ft.uncompressedOffsets.includes(0)),
  )
    ? 'all'
    : '';

  const highlight =
    fts.find((o: FormatTagNoteOffsets) => o.highlight === true) !== undefined
      ? 'highlight'
      : '';

  const refCount =
    fts.length > 0 ? (fts.length > 1 ? 'ref-double' : 'ref-single') : '';
  return `${all} ${refCount} ${highlight}`;
}

export class FormatTag extends Component<{
  formatMerged: FormatMerged;
  offsets: string;
}> {
  public state: {
    formatMerged: FormatMerged;
    classList: string;
    text: string;
  };

  public style: CSSProperties = {
    backgroundColor: 'inherit',
  };
  public className = '';

  constructor(props) {
    super(props);
    // this.state = { formatMerged: this.props.formatMerged };
    const fm = this.props.formatMerged;

    fm.all = fm.formatTags.find(f => f.offsets === 'all') !== null;
    if (fm.all) {
      this.className = 'all';
    }
  }

  componentDidMount() {
    this.setState({ text: this.props.formatMerged.text });
    this.setState({ formatMerged: this.props.formatMerged });
    this.setState({ offset: this.props.formatMerged.offset });

    store.updateFTags$
      .pipe(
        map(() => {
          this.setState({
            classList: `${calcClassList(this.props.formatMerged)} f-t`,
          });
        }),
      )
      .subscribe();
  }

  public click(fm: FormatMerged) {
    // this.style = { backgroundColor: "black" };

    const setNotesMode = () => {
      return appSettings.notesMode$.pipe(
        take(1),
        map(o => {
          if (o === 'off') {
            appSettings.notesMode$.next('small');
            appSettings.displayNotes();
            resetMobileNotes.next(true);
          }
        }),
      );
    };
    const fm$ = of(fm).pipe(
      filter(
        o => o.formatTags && o.formatTags.filter(o => o.visible).length > 0,
      ),
      map(o => formatTagService.fMergedClick(o)),
      flatMap$,
      map(() => {
        store.updateFTags$.next(true);
        store.updateNoteVisibility$.next(true);
      }),
      delay(100),
    );

    forkJoin(setNotesMode(), fm$).subscribe(() => {
      const vng = document.querySelector('.verse-note-group.highlight'); //.scrollIntoView();

      if (vng) {
        vng.scrollIntoView();
      }
    });
    // of(fm)
    //   .pipe(
    //     filter(
    //       o => o.formatTags && o.formatTags.filter(o => o.visible).length > 0,
    //     ),
    //     map(o => formatTagService.fMergedClick(o)),
    //     flatMap$,
    //     map(() => {
    //       store.updateFTags$.next(true);
    //       store.updateNoteVisibility$.next(true);
    //     }),
    //     delay(100),
    //   )
    //   .subscribe(() => {
    //     const vng = document.querySelector('.verse-note-group.highlight'); //.scrollIntoView();

    //     if (vng) {
    //       vng.scrollIntoView();
    //     }
    //   });

    // of(fm.formatTags as FormatTagNoteOffsets[])
    //   .pipe(
    //     flatMap$,
    //     filter(o => o.visible),
    //     map(o => {
    //       console.log(o);
    //       o.highlight = !o.highlight;
    //     }),
    //     toArray(),
    //   )
    //   .subscribe(() => {
    //     store.updateFTags$.next(true);
    //     store.updateNoteVisibility$.next(true);
    //   });

    // this.setState({ style: this.style });
    // this.state.formatMerged.text = "lkasdf";
    // this.setState((state, props) => {
    //
    // });
  }
  public renderSpeaker() {
    if (this.state) {
      const flatNotes = flatten(
        (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
          .filter(n => Array.isArray(n.notes))
          .filter(
            n =>
              n.notes.filter(note =>
                note.ref.find(ref => ref.label.includes(`🔊`)),
              ).length > 0,
          ),
      );
      const hasPronunciation = () => {
        return flatten(
          flatten(
            (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
              .filter(n => Array.isArray(n.notes))
              .map(n => n.notes),
          ).map(n => n.ref),
        ).find(ref => ref.label.includes(`🔊`));
      };
      const ref = hasPronunciation();
      if (this.state.formatMerged && ref) {
        if (
          flatNotes[0].uncompressedOffsets[0] === this.state.formatMerged.offset
        ) {
          return (
            <span
              className={`ftag-speaker`}
              onClick={() => {
                try {
                  const fileName = `${parseSubdomain().audioURL}${flatten(
                    (this.state.formatMerged
                      .formatTags as FormatTagNoteOffsets[])
                      .filter(n => Array.isArray(n.notes))
                      .map(n => n.notes),
                  )[0]
                    .phrase?.toLowerCase()
                    .replace('“', '')
                    .replace('”', '')}.wav`;
                  new Audio(fileName).play();
                } catch (error) {}
              }}
            ></span>
          );
        }
      }
    }
    return <></>;
  }
  hasLetters() {
    const hasVis = (note: Note[]) => {
      return note.filter(n => n.formatTag.visible);
    };
    return flatten(
      flatten(
        (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
          .filter(n => Array.isArray(n.notes))
          .map(n => hasVis(n.notes)),
      ).map(n => n.sup),
    );
  }

  hasLSup() {
    if (this.state && !parseSubdomain().soglo) {
      const hasVis = (note: Note[]) => {
        return note.filter(n => n.formatTag.visible);
      };
      const l =
        flatten(
          flatten(
            (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
              .filter(n => Array.isArray(n.notes))
              .map(n => hasVis(n.notes)),
          )
            .filter(n => n.lSup !== undefined)
            .map(n => n.lSup),
        ).length > 0;

      return l ? 'has-lsup' : '';
    }
    return '';
  }
  getLetters() {
    if (this.state) {
      const hasVis = (note: Note[]) => {
        return note.filter(n => n.formatTag.visible && n.sup !== undefined);
      };
      return uniq(
        flatten(
          flatten(
            (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
              .filter(n => Array.isArray(n.notes))
              .map(n => hasVis(n.notes)),
          ).map(n => n.sup),
        ),
      );
    }
    return [];
  }
  renderLetters() {
    if (this.state && !parseSubdomain().soglo) {
      // const hasLetters = () => {
      //   const hasVis = (note: Note[]) => {
      //     return note.filter(n => n.formatTag.visible && n.sup !== undefined);
      //   };
      //   return flatten(
      //     flatten(
      //       (this.state.formatMerged.formatTags as FormatTagNoteOffsets[])
      //         .filter(n => Array.isArray(n.notes))
      //         .map(n => hasVis(n.notes)),
      //     ).map(n => n.sup),
      //   );
      // };
      // return <span style={{ content: hasLetters().join('') }}></span>;

      /// This does a check to see if the offset for this format tag
      /// is in the first offset grouping. If not, no superscript is shown
      const offsets = this.state.formatMerged?.formatTags[0]?.offsets?.split(
        ',',
      );
      if (
        offsets &&
        offsets[0].startsWith(this.state?.formatMerged?.offset.toString())
      ) {
        return (
          <sup
            // className={`${uniq(hasLetters()).join('')}`}
            style={{ userSelect: 'none' }}
          >
            {this.getLetters().join('')}
          </sup>
        );
      }
    }
    return <></>;
  }
  public render() {
    const letters = this.renderLetters();
    return (
      <span
        className={`${displayStateKey(
          this.state,
          'classList',
        )} ${this.hasLSup()} ${this.getLetters().map(
          letter => `sup-elm-${letter} `,
        )}`}
        style={this.style}
        data-offset={`${this.state ? this.state['offset'] : ''}`}
        onClick={evt => {
          const elem = evt.target as HTMLElement;
          if (elem && !elem.classList.contains('ftag-speaker')) {
            this.click(this.state.formatMerged);
          }
        }}
      >
        {this.renderSpeaker()}
        {this.renderLetters()}
        {displayStateKey(this.state, 'text')}
      </span>
    );
  }
}
