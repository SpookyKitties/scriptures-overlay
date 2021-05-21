import { Component } from 'react';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { map, take, flatMap, filter } from 'rxjs/operators';
import { appSettings, store } from '../SettingsComponent';
import { NoteType } from '../../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { exportNotes } from './exportNotes';
import { PouchyRx } from '../import-notes/import-notes/PouchyRx';
import { Chapter } from '../../oith-lib/src/models/Chapter';

export let openExportModal: BehaviorSubject<boolean>;
export let resetCheckboxes: BehaviorSubject<boolean>;

class ExportModalCheckBox extends Component<{ noteType: NoteType }> {
  public state: { enabled: boolean };
  componentDidMount() {
    this.setState({ enabled: false });

    resetCheckboxes.subscribe(() => {
      this.setState({ enabled: false });
    });
  }
  public render() {
    if (this.state) {
      return (
        <label
          className={`checkbox ${
            this.state.enabled
              ? `checked-overlay ${this.props.noteType.className}`
              : ''
          }`}
          onClick={() => {
            this.setState({ enabled: !this.state.enabled });
          }}
        >
          <input type="checkbox" checked={this.state.enabled} />
          {this.props.noteType.name}
        </label>
      );
    }

    return <></>;
  }
}

function addToDatabaseIfNotIn() {
  let database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);

  return store.chapter.pipe(
    take(1),
    filter(chapter => chapter !== undefined),
    map(chapter => {
      return database.get<Chapter>(chapter.id).pipe(
        map(val => {
          if (!val) {
            return database.put$(chapter, 'id');
          }
          return EMPTY;
        }),
      );
    }),
    flatMap(o => o),
    flatMap(o => o),
  );
}

export class ExportModal extends Component {
  public state: {
    active: boolean;
    noteTypes: NoteType[];
    none: boolean;
    ot: boolean;
    nt: boolean;
    bofm: boolean;
    dc: boolean;
    pgp: boolean;
  };

  public componentDidMount() {
    openExportModal = new BehaviorSubject(false);
    resetCheckboxes = new BehaviorSubject(false);
    this.setState({ none: true });

    openExportModal
      .pipe(
        map(o => {
          resetCheckboxes.next(true);

          this.setState({ active: o });
          if (appSettings && appSettings.noteTypes) {
            this.setState({
              noteTypes: appSettings.noteTypes.noteTypes,
            });
          }
          Array.from(
            document.querySelectorAll('.testamentExportSelection input'),
          ).map((elm: HTMLInputElement) => (elm.checked = false));
          return addToDatabaseIfNotIn();
        }),
        flatMap(o => o),
      )
      .subscribe();
  }
  testamentSelectionClick(elm: HTMLElement) {
    this.setState({ none: false });
    this.setState({ ot: false });
    this.setState({ nt: false });
    this.setState({ dc: false });
    this.setState({ pgp: false });
    this.setState({ [`${(elm as HTMLInputElement).value}`]: true });

    // Array.from(
    //   document.querySelectorAll('.testamentExportSelection input'),
    // ).map((elm: HTMLInputElement) => (elm.checked = false));
    // (elm as HTMLInputElement).checked = true;
  }

  public render() {
    if (this.state && this.state.noteTypes) {
      return (
        <div className={`modal ${this.state.active ? 'is-active' : ''}`}>
          <div
            className={`modal-background  `}
            style={{ backgroundColor: 'unset' }}
            onClick={() => {
              openExportModal.next(false);
            }}
          ></div>
          <div className={`modal-content `}>
            <div className={`box export-modal-content`}>
              {this.state.noteTypes.map(noteType => {
                return <ExportModalCheckBox noteType={noteType} />;
              })}
              <div
                className="testamentExportSelection control"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}
              >
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentNone"
                    value="none"
                    checked={this.state?.none}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  None
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentOT"
                    value="ot"
                    checked={this.state?.ot}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  OT
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentNT"
                    value="nt"
                    checked={this.state?.nt}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  NT
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentBOFM"
                    value="bofm"
                    checked={this.state?.bofm}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  BOFM
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentDC"
                    value="dc"
                    checked={this.state?.dc}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  DC
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="testamentPGP"
                    value="pgp"
                    checked={this.state?.pgp}
                    onClick={evt =>
                      this.testamentSelectionClick(evt.target as HTMLElement)
                    }
                  />
                  PGP
                </label>
              </div>

              <a
                className={`button is-light`}
                onClick={() => {
                  exportNotes().subscribe(o => {
                    console.log(o);
                  });
                }}
              >
                Export
              </a>
            </div>
          </div>
          <a
            className="modal-close is-large"
            aria-label="close"
            onClick={() => {
              openExportModal.next(false);
            }}
          ></a>
        </div>
      );
    }
    return <></>;
  }
}
