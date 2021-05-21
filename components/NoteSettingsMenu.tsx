import Router from 'next/router';
import { Component, CSSProperties, MouseEvent } from 'react';
import { NoteSetting } from '../oith-lib/src/processors/NoteSettings';
import { appSettings, formatTagService, store } from './SettingsComponent';
import { openExportModal } from './note-offsets/export-modal';
import { closeMenu$ } from './header.component';
import { take } from 'rxjs/operators';
import {
  AdditionalSettingaComponent,
  NoteSettingComponent,
} from './notes-settings/add-settings';
import { parseSubdomain } from './parseSubdomain';

const noteSettingsMenuStyles: CSSProperties = {
  position: 'absolute',
  // minWidth: '12rem',
  paddingTop: '4px',
  top: '100%',
  zIndex: 20,
  backgroundColor: 'white',
  // right: '0px',
  // left: 'unset',
  // width: '250px',
  // height: 'calc(100vh - 48px)',
  overflowY: 'scroll',
};

class NoteSettingComponentOld extends Component<{ noteSetting: NoteSetting }> {
  public state: { noteSetting: NoteSetting; enabled: boolean };

  private noteSettingClick(event: MouseEvent, noteSetting: NoteSetting) {
    event.preventDefault();

    noteSetting.enabled =
      (event.target as HTMLInputElement).checked !== undefined
        ? (event.target as HTMLInputElement).checked
        : !noteSetting.enabled;
    this.setState({ enabled: noteSetting.enabled });

    appSettings.save('noteSettings');
    formatTagService.reset();
    store.resetNotes$.next(true);
  }
  componentDidMount() {
    this.setState({
      noteSetting: this.props.noteSetting,
      enabled: this.props.noteSetting.enabled,
    });
  }

  public render() {
    if (this.state) {
      return (
        <div
          className={`dropdown-item`}
          onClick={event =>
            this.noteSettingClick(event, this.state.noteSetting)
          }
        >
          <label className={`checkbox`}>
            <input type="checkbox" checked={this.state.enabled} />
            {this.state.noteSetting.label}
          </label>
        </div>
      );
    }

    return <></>;
  }
}
const menubtn: CSSProperties = {
  display: 'grid',
  height: '42px',
  justifyContent: 'center',
  alignContent: 'center',
  background: 'inherit',
};

export class DevSettings extends Component {
  public render() {
    if (!parseSubdomain().soglo) {
      return (
        <div style={{ backgroundColor: 'inherit' }}>
          <hr />
          <div
            style={menubtn}
            onClick={() => {
              if (store) {
                store.editMode$.pipe(take(1)).subscribe(o => {
                  store.editMode$.next(!o);
                });
              }
            }}
          >
            Edit Mode
          </div>
          <hr />

          <div
            style={menubtn}
            onClick={() => {
              openExportModal.next(true);
            }}
          >
            Export Notes
          </div>

          <hr />
          {/* <div
            style={menubtn}
            onClick={() => {
              appSettings.displayUnderline();
            }}
          >
            Hide Underlining
          </div> */}

          {/* <hr /> */}
          <div
            style={menubtn}
            onClick={() => {
              Router.push('/settings');
              closeMenu$.next(true);
            }}
          >
            Settings
          </div>
        </div>
      );
    }
    return <></>;
  }
}

export class NoteSettingsMenu extends Component<{
  displayNoteSettings?: boolean;
}> {
  private renderNoteSettings() {
    if (appSettings && appSettings.noteSettings) {
      return (
        <div className={``}>
          {appSettings.noteSettings.noteSettings
            .filter(ns => ns.display)
            .map(noteSetting => {
              return (
                <NoteSettingComponent
                  setting={noteSetting}
                ></NoteSettingComponent>
              );
            })}
        </div>
      );
    }
    return <></>;
  }

  public render() {
    if (appSettings) {
      return (
        <div
          style={noteSettingsMenuStyles}
          className={`note-settings-menu  dropdown-menu`}
        >
          <div className={`dropdowggn-content`}>
            <div style={{ textAlign: 'center' }}>Note Sets</div>
            <hr />
            {this.renderNoteSettings()}
            <AdditionalSettingaComponent />
            <DevSettings />
          </div>
        </div>
      );
    }
    return <></>;
  }
}
