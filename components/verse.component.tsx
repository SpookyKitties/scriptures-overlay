import { Verse } from '../oith-lib/src/models/Chapter';
import { renderFormatGroups } from './chapter.component';
import { Component, Fragment, CSSProperties } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';
import { store } from './SettingsComponent';
import { VerseNoteGroupComponent } from './verse-notes/VerseNoteGroupComponent';
import { parseSubdomain } from './parseSubdomain';

type VerseProps = {
  verse?: Verse;
};

const inlineNotes: CSSProperties = {
  overflowY: 'scroll',
  maxHeight: '9.5rem',
  /* width: 88%, */
  backgroundColor: '#f3f3f3',
  /* padding-left: 20px, */
  fontSize: '1rem',
  /* position: absolute, */
  paddingLeft: '10px !important',
  justifyItems: 'center',
  padding: '5px 5px 5px 10px',
  marginBottom: '10px',
  width: '100%',
  justifySelf: 'center',
  scrollbarWidth: 'thin',
};

export class VerseComponent extends Component<VerseProps> {
  public state: { verse?: Verse; highlight?: boolean };
  updateVerseSub: Subscription;
  componentWillUnmount() {
    if (this.updateVerseSub) {
      this.updateVerseSub.unsubscribe();
    }
  }
  componentDidMount() {
    const verse = this.props.verse;
    this.setState({ verse: verse });

    this.updateVerseSub = store.updateVerses.subscribe(() => {
      // const verse = this.state.verse; //;
      this.setState({ verse: undefined });
      this.setState({ verse: verse });
    });
  }
  public constructor(props: VerseProps) {
    super(props);
  }
  public render() {
    let elem: JSX.Element = <></>;
    if (this.state) {
      const verse = this.state.verse;

      if (verse) {
        const elementName = verse.n.toLowerCase();
        const attrClass = verse.attrs['class'];
        const classList = `verse ${verse.highlight ? 'highlight' : ''} ${
          verse.context ? 'context' : ''
        } ${attrClass ? attrClass : ''}`;

        verse.attrs['class'] = undefined;
        switch (elementName) {
          case 'p': {
            elem = (
              <p id={verse.id} className={` ${classList}`} {...verse.attrs}>
                {renderFormatGroups(verse.grps)}
              </p>
              // <Fragment>
              //   {verse.verseNote && parseSubdomain().beta ? (
              //     <div style={{ display: 'grid' }} className={`inline-notes`}>
              //       <div style={inlineNotes}>
              //         {verse.verseNote && parseSubdomain().beta ? (
              //           verse.verseNote.noteGroups.map(vNG => (
              //             <VerseNoteGroupComponent noteGroup={vNG} />
              //           ))
              //         ) : (
              //           <></>
              //         )}
              //         <div className={`note-whitespace`}></div>
              //       </div>
              //     </div>
              //   ) : (
              //     <></>
              //   )}
              // </Fragment>
            );
            break;
          }
          case 'figure': {
            elem = (
              <figure
                {...verse.attrs}
                id={verse.id}
                className={` ${classList}`}
              >
                {renderFormatGroups(verse.grps)}
              </figure>
            );
            break;
          }
          case 'h1': {
            elem = (
              <h1 {...verse.attrs} id={verse.id} className={` ${classList}`}>
                {renderFormatGroups(verse.grps)}
              </h1>
            );
            break;
          }
          case 'h2': {
            elem = (
              <h2 {...verse.attrs} id={verse.id} className={` ${classList}`}>
                {renderFormatGroups(verse.grps)}
              </h2>
            );
            break;
          }
          case 'h3': {
            elem = (
              <h3 {...verse.attrs} id={verse.id} className={` ${classList}`}>
                {renderFormatGroups(verse.grps)}
              </h3>
            );
            break;
          }
          case 'h4': {
            elem = (
              <h4 {...verse.attrs} id={verse.id} className={` ${classList}`}>
                {renderFormatGroups(verse.grps)}
              </h4>
            );
            break;
          }
          case 'dt': {
            elem = (
              <dt {...verse.attrs} id={verse.id} className={` ${classList}`}>
                {renderFormatGroups(verse.grps)}
              </dt>
            );
            break;
          }
          default:
            elem = <div>Missing verse element {verse.n}</div>;
            break;
        }
      }
    }
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 24px',
          justifyContent: 'center',
        }}
      >
        {elem}
        {/* <span
          className={'test-test-test'}
          style={{
            display: 'grid',
            justifyContent: 'center',
            alignContent: 'center',
            transform: 'translateX(24px)',
          }}
        >
          📽
        </span> */}
      </div>
    );
    // return elem;
  }
}
