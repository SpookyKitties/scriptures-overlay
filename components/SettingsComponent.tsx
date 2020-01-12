import { Component } from 'react';
import { Store } from '../pages/_app';
import { AppSettings } from './AppSettings';
import { FormatTagService } from './FormatTagService';
import { setCurrentNav } from './nextPage';
import { parseLangFromUrl } from '../app/parseCookieLang';
import { resetNoteVisibilitySettings } from './resetNoteVisibility';
import { map, filter } from 'rxjs/operators';
import { AnalyticsService } from './analyticsService';
export let formatTagService: FormatTagService;

export let appSettings: AppSettings;
export let analyticsService: AnalyticsService;
export let store: Store;
export class SettingsComponent extends Component {
  public componentDidMount() {
    const lang = parseLangFromUrl();
    appSettings = new AppSettings(lang);
    analyticsService = new AnalyticsService();
    if (appSettings.settings.lang === 'pes') {
      document.body.classList.add('right-to-left');
    }
    if (!store) {
      store = new Store();
    }
    formatTagService = new FormatTagService();

    store.resetNotes$
      .pipe(
        map(() => {
          if (
            appSettings.noteSettings &&
            appSettings.noteSettings.addSettings
          ) {
            const jstModeSetting = appSettings.noteSettings.addSettings.find(
              addSetting => addSetting.additionalcontent === 'jst-comparison',
            );
            if (jstModeSetting && jstModeSetting.enabled) {
              document.body.classList.add('jst-comparison');
            } else {
              document.body.classList.remove('jst-comparison');
            }
            const proModeSetting = appSettings.noteSettings.addSettings.find(
              addSetting => addSetting.additionalcontent === 'pronunciation',
            );
            if (proModeSetting && proModeSetting.enabled) {
              document.body.classList.add('speaker');
            } else {
              document.body.classList.remove('speaker');
            }
          }
        }),
      )
      .subscribe();
    store.editMode$.subscribe(o => {
      if (o) {
        document.body.classList.add('edit-mode');
      } else {
        document.body.classList.remove('edit-mode');
      }
    });
    setCurrentNav();
    // resetNoteVisibilitySettings().subscribe(o => o);
  }
  public render() {
    return <></>;
  }
}
