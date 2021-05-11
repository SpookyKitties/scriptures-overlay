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
  public state: { active: boolean; noteTypes: NoteType[] };

  public componentDidMount() {
    openExportModal = new BehaviorSubject(false);
    resetCheckboxes = new BehaviorSubject(false);

    openExportModal
      .pipe(
        map(o => {
          resetCheckboxes.next(true);

          this.setState({ active: o });
          if (appSettings && appSettings.noteTypes) {
            this.setState({ noteTypes: appSettings.noteTypes.noteTypes });
          }

          return addToDatabaseIfNotIn();
        }),
        flatMap(o => o),
      )
      .subscribe();
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
              <a
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
