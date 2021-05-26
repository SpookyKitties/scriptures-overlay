import axios from 'axios';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { NoteSettingsNew } from '../new_preprocessor/lib/models/Settings/NoteSettings';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { flattenPrimaryManifest } from './flattenPrimaryManifest';
import { NavigationItem } from './navigation-item';
import { parseSubdomain } from './parseSubdomain';
import { resetNotes$ } from './resetNotes';
import { Settings } from './Settings';

// const flattenPrimaryManifest = (navItem: NavigationItem): NavigationItem[] => {
//   if (Array.isArray(navItem.navigationItems)) {
//     return flatten(
//       navItem.navigationItems
//         .map(nI => flattenPrimaryManifest(nI))
//         .concat([navItem]),
//     );
//   }

//   return [navItem];
// };

export class AppSettings {
  public settings: Settings;
  public noteSettings?: NoteSettings;
  public displayNav$: BehaviorSubject<boolean>; //(false);
  public displayUnderline$: BehaviorSubject<boolean>; //(false);
  public notesMode$: BehaviorSubject<string>;
  public navigation$ = new BehaviorSubject<NavigationItem>(undefined);
  public updatenavigation$ = new BehaviorSubject<boolean>(undefined);
  public flatNavigation$ = new BehaviorSubject<NavigationItem[]>(undefined);
  public flatNavigationParents$ = new BehaviorSubject<NavigationItem[]>(
    undefined,
  );

  public fuse$: BehaviorSubject<any>;
  public newNoteSettings?: NoteSettingsNew;

  constructor(lang: string) {
    const settingsS = localStorage.getItem(
      `${lang}-scriptures-overlay-settings`,
    );
    this.settings = settingsS ? JSON.parse(settingsS) : new Settings(lang);
    this.displayNav$ = new BehaviorSubject(this.settings.displayNav);
    this.displayUnderline$ = new BehaviorSubject(
      this.settings.displayUnderline !== false,
    );
    this.notesMode$ = new BehaviorSubject(this.settings.notesMode);

    this.loadNoteSettings().subscribe(() => {
      this.initNav();
      this.flattenNavigation();
    });
  }

  private flattenNavigation() {
    this.navigation$
      .pipe(
        filter(o => o !== undefined),
        map(navigation => {
          const o = flattenPrimaryManifest(navigation);

          this.flatNavigation$.next(o);
        }),
        // flatMap$,
      )
      .subscribe();
  }
  private async initNav() {
    const subdomain = parseSubdomain();
    try {
      await of(
        axios.get(
          `https://oithstorage.blob.core.windows.net/blobtest/${this.settings.lang}-navigation.json`,
          {
            responseType: 'json',
          },
        ),
      )
        .pipe(
          flatMap(o => o),
          map(o => {
            this.navigation$.next(o.data as NavigationItem);
          }),
        )
        .toPromise();
    } catch (error) {}
  }

  public async loadNewNoteSettings() {
    const subD = parseSubdomain();

    const settings = await axios.get(
      `${subD.storageURL}${this.settings.lang}-dev-settings.json`,
      {
        responseType: 'json',
      },
    );

    this.newNoteSettings = settings.data as NoteSettingsNew;
    this.save('newNoteSettings');
  }
  public loadNoteSettings() {
    const noteSettingsS = localStorage.getItem(
      `${this.settings.lang}-scriptures-overlay-noteSettings`,
    );

    this.noteSettings = noteSettingsS ? JSON.parse(noteSettingsS) : undefined;
    return (
      forkJoin(of(this.loadNewNoteSettings()).pipe(flatMap$))
        // .pipe(flatMap(o => o))
        .pipe(
          map(o => {
            resetNotes$();
          }),
        )
    );
  }
  public displayNav() {
    this.settings.displayNav = !this.settings.displayNav;
    this.displayNav$.next(this.settings.displayNav);
    this.save('settings');
  }
  public displayUnderline() {
    if (this.settings.displayUnderline !== false) {
      this.settings.displayUnderline = false;
    } else {
      this.settings.displayUnderline = true;
    }
    this.displayUnderline$.next(this.settings.displayUnderline);
    this.save('settings');
  }
  public displayNotes() {
    const displayNotes = this.settings.notesMode;

    const width = window.outerWidth;

    if (displayNotes === 'off' || typeof displayNotes === 'undefined') {
      this.settings.notesMode = 'small';
    } else if (displayNotes === 'small') {
      if (window.matchMedia('(min-width: 500.01px)').matches) {
        this.settings.notesMode = 'off';
      } else {
        this.settings.notesMode = 'large';
      }
    } else {
      this.settings.notesMode = 'off';
    }

    this.save('settings');

    this.notesMode$.next(this.settings.notesMode);
  }
  public save<T extends keyof this>(key: T) {
    localStorage.setItem(
      `${this.settings.lang}-scriptures-overlay-${key}`,
      JSON.stringify(this[key]),
    );
  }
}
