// import layout from '../components/layout';
import Layout from '../components/layout';
import { ChapterComponent } from '../components/chapter';
import { NextPage } from 'next';

import { importFiles } from '../components/import-notes/import-notes/importFiles';
import { Component } from 'react';
import {
  PouchyRx,
  DBItem,
} from '../components/import-notes/import-notes/PouchyRx';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
function showProgress() {
  return (
    <progress className="progress is-small is-primary" max="100">
      15%
    </progress>
  );
}

function reloadSettings() {
  let database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);

  const save = (settingName: string, setting: DBItem<object | unknown>) => {
    if (setting) {
      localStorage.setItem(settingName, JSON.stringify(setting.doc));
    }
  };
  const settings = database
    .get<NoteSettings>(`eng-note-settings`)
    .pipe(
      map(noteSettings =>
        save('eng-scriptures-overlay-noteSettings', noteSettings),
      ),
    );
  const cats = database
    .get(`eng-note-categories`)
    .pipe(
      map(noteSettings =>
        save('eng-scriptures-overlay-noteCategories', noteSettings),
      ),
    );
  const types = database
    .get(`eng-note-types`)
    .pipe(
      map(noteSettings =>
        save('eng-scriptures-overlay-noteTypes', noteSettings),
      ),
    );

  return forkJoin(settings, cats, types);
}

export default class SettimgsPage extends Component {
  public state: { progress: boolean };
  render() {
    if (this.state && this.state.progress) {
      return showProgress();
    }
    return (
      <div>
        <input type="file" name="" id="fileUpload" multiple />{' '}
        <button
          className={`button`}
          onClick={() => {
            this.setState({ progress: true });
            importFiles('#fileUpload')
              .pipe()
              .subscribe(
                () => {},
                () => {},
                () => {
                  this.setState({ progress: false });
                  reloadSettings().subscribe(() => {
                    window.history.back();

                    setTimeout(() => {
                      location.reload();
                    }, 1000);
                  });
                },
              );
          }}
        >
          Upload
        </button>
      </div>
    );
  }
}
