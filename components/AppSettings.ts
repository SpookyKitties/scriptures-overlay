import axios from 'axios';
import Fuse from 'fuse.js';
import { cloneDeep, flatten } from 'lodash';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import {
  NoteCategories,
  NoteTypes,
} from '../oith-lib/src/verse-notes/settings/note-gorup-settings';
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
  public noteTypes?: NoteTypes;
  public displayNav$: BehaviorSubject<boolean>; //(false);
  public displayUnderline$: BehaviorSubject<boolean>; //(false);
  public notesMode$: BehaviorSubject<string>;
  public navigation$ = new BehaviorSubject<NavigationItem>(undefined);
  public updatenavigation$ = new BehaviorSubject<boolean>(undefined);
  public flatNavigation$ = new BehaviorSubject<NavigationItem[]>(undefined);
  '';
  public flatNavigationParents$ = new BehaviorSubject<NavigationItem[]>(
    undefined,
  );

  public fuse$: BehaviorSubject<any>;

  public noteCategories?: NoteCategories;
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

  private async getNoteTypeSettings<T extends keyof AppSettings>(
    key: T,
    fileName: 'noteSettings' | 'noteCategories' | 'noteTypes',
  ) {
    if (!this[key] || (this[key] && fileName !== 'noteSettings')) {
      const lang = this.settings.lang;

      const subD = parseSubdomain();
      try {
        const data = await axios.get(
          `${subD.storageURL}${'eng'}-${subD.settings}${fileName}.json`,
          {
            responseType: 'json',
          },
        );
        this[key] = data.data;
        this.save(key);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private flattenNavigation() {
    this.navigation$
      .pipe(
        filter(o => o !== undefined),
        map(navigation => {
          const o = flattenPrimaryManifest(navigation);

          this.flatNavigation$.next(o);
          // const hg = cloneDeep(o);

          // const fuse = new Fuse(
          //   hg.map(n => {
          //     n.title = n.title.toLowerCase();
          //     n.shortTitle = n.shortTitle.toLowerCase();
          //     return n;
          //   }),
          //   {
          //     keys: ['title', 'shortTitle', 'href'],
          //     threshold: 0.35,
          //     includeScore: true,
          //     caseSensitive: false,
          //     tokenize: true,
          //     location: 0,
          //   },
          // );

          // this.fuse$ = new BehaviorSubject(fuse);
          // return of(flattenPrimaryManifest(navigation)).pipe(
          //   map(o => {
          //     this.flatNavigation$.next(o);
          //     const hg = cloneDeep(o);

          //     const fuse = new Fuse(
          //       hg.map(n => {
          //         n.title = n.title.toLowerCase();
          //         n.shortTitle = n.shortTitle.toLowerCase();
          //         return n;
          //       }),
          //       {
          //         keys: ['title', 'shortTitle', 'href'],
          //         threshold: 0.35,
          //         includeScore: true,
          //         caseSensitive: false,
          //         tokenize: true,
          //         location: 0,
          //       },
          //     );

          //     this.fuse$ = new BehaviorSubject(fuse);
          //   }),
          // );
        }),
        // flatMap$,
      )
      .subscribe();
  }
  private initNav() {
    const subdomain = parseSubdomain();
    of(
      axios.get(
        `https://oithstorage.blob.core.windows.net/blobtest/${this.settings.lang}-navigation.json`,
        {
          responseType: 'json',
        },
      ),
    )
      .pipe(
        flatMap(o => o),
        map(o => o.data as NavigationItem),
      )
      .subscribe(o => {
        this.navigation$.next(o);
      });
  }
  public loadNoteSettings() {
    const noteCategoriesS = localStorage.getItem(
      `eng-scriptures-overlay-noteCategories`,
    );

    this.noteCategories = noteCategoriesS
      ? JSON.parse(noteCategoriesS)
      : undefined;
    const noteSettingsS = localStorage.getItem(
      `eng-scriptures-overlay-noteSettings`,
    );
    const noteTypesS = localStorage.getItem(`eng-scriptures-overlay-noteTypes`);

    this.noteSettings = noteSettingsS ? JSON.parse(noteSettingsS) : undefined;
    this.noteTypes = noteTypesS ? JSON.parse(noteTypesS) : undefined;
    return (
      forkJoin(
        of(this.getNoteTypeSettings('noteSettings', 'noteSettings')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteCategories', 'noteCategories')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteTypes', 'noteTypes')).pipe(flatMap$),
      )
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
