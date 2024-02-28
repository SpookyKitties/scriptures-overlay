import axios from 'axios';
import { flatten } from 'lodash';
import { EMPTY, Observable, forkJoin, of } from 'rxjs';
import { filter, find, flatMap, map, toArray } from 'rxjs/operators';
import { appSettings } from '../../../components/SettingsComponent';
import { VideoData } from '../../../components/VideoComponent';
import { parseSubdomain } from '../../../components/parseSubdomain';
import {
  Chapter,
  FormatGroup,
  FormatText,
  Verse,
  VersePlaceholder,
} from '../models/Chapter';
import { flatMap$ } from '../rx/flatMap$';
import { NoteCategories } from '../verse-notes/settings/note-gorup-settings';
import { Note, VerseNote } from '../verse-notes/verse-note';
import { buildFMerged } from './buildFMerged';
import { generateVerseNoteGroup } from './generateVerseNoteGroup';

function findFormatGroupsWithVerseIDs(
  formatGroup: FormatGroup,
): Observable<VersePlaceholder> {
  return of(
    formatGroup.grps as (FormatGroup | FormatText | VersePlaceholder)[],
  ).pipe(
    filter((o) => o !== undefined),
    flatMap$,
    map((o) => {
      if ((o as VersePlaceholder).v !== undefined) {
        return of(o as VersePlaceholder);
      }
      return findFormatGroupsWithVerseIDs(o as FormatGroup);
    }),
    flatMap$,
  );
}
function findFormatGroupsWithVerseIDs2(
  formatGroup: FormatGroup,
): VersePlaceholder[] {
  return flatten(
    (formatGroup.grps as (FormatGroup | FormatText | VersePlaceholder)[]).map(
      (grp) => {
        if ((grp as VersePlaceholder).v !== undefined) {
          return [grp as VersePlaceholder];
        }
        return findFormatGroupsWithVerseIDs2(grp as FormatGroup);
      },
    ),
  );
  // return of(formatGroup.grps as (
  //   | FormatGroup
  //   | FormatText
  //   | VersePlaceholder)[]).pipe(
  //     filter(o => o !== undefined),
  //     flatMap$,
  //     map(o => {
  //       if ((o as VersePlaceholder).v !== undefined) {
  //         return of(o as VersePlaceholder);
  //       }
  //       return findFormatGroupsWithVerseIDs(o as FormatGroup);
  //     }),
  //     flatMap$,
  //   );
}

function findVerse(verses: Verse[], verseID: string) {
  return of(verses.find((v) => v.id === verseID));
}

export function generateVerseNoteShell(chapter: Chapter) {
  const verseNotes = chapter.verses
    .map((v) => {
      return (
        chapter.verseNotes
          ? chapter.verseNotes.find(
              (vN) =>
                vN.id ===
                `${chapter.id.replace('-chapter', '')}-${v.id}-verse-notes`,
            )
          : undefined
      ) as VerseNote;
    })
    .filter((o) => o !== undefined);
  return of((chapter.verseNotes = verseNotes));
}

// export function prepareVerseNotes(verseNotes: VerseNote[]) {}

export function addVersesToBody(chapter: Chapter) {
  // (flatMapDeep(chapter.body.grps));

  const addVerses = () =>
    findFormatGroupsWithVerseIDs2(chapter.body).map((o) => {
      o.verse = chapter.verses.find((v) => v.id === o.v);
    });

  return of(addVerses());

  // return findFormatGroupsWithVerseIDs(chapter.body).pipe(
  //   map(o => {
  //     o.verse = chapter.verses.find(v => v.id === o.v);
  //   }),

  //   toArray(),
  // );
}

function extractFormatText(
  verse: FormatGroup | Verse | FormatText,
): Observable<FormatText> {
  if (Array.isArray((verse as FormatGroup | Verse).grps)) {
    return of(
      (verse as FormatGroup | Verse).grps as (FormatGroup | FormatText)[],
    ).pipe(
      flatMap$,
      map((o) => extractFormatText(o)),
      flatMap$,
    );
  } else if ((verse as FormatText).docType === 5) {
    return of(verse as FormatText);
  }

  return EMPTY;
}

function highlightContext(
  verses: Verse[],
  chapterParams: ChapterParams,
  hC: 'highlight' | 'context',
) {
  (chapterParams[hC] as string).split(',').map((h) => {
    if (h.includes('-')) {
      const hSplit = h.split('-');

      const firstIndex = verses.findIndex((v) => v.id === hSplit[0]);
      const lastIndex = verses.findIndex((v) => v.id === hSplit[1]);

      verses.slice(firstIndex, lastIndex + 1).map((v) => (v[hC] = true));
    } else {
      const verse = verses.find((v) => v.id === h);
      if (verse) {
        verse[hC] = true;
      }
    }
  });
}

export function highlightVerses(verses: Verse[], chapterParams: ChapterParams) {
  if (chapterParams.highlight) {
    highlightContext(verses, chapterParams, 'highlight');
  }
  if (chapterParams.context) {
    highlightContext(verses, chapterParams, 'context');
  }
}
export function getSup(note: Note) {
  console.log(note.sup);

  if (note.sup) {
    return `sup-${note.sup}`;
  }
  if (note.lSup) {
    return `lsup-${note.lSup}`;
  }
  return 'undefined';
}

export const hasMoreStillNotes = (notes: Note[]) => {
  return (
    notes.filter(
      (note) => note.ref.filter((ref) => ref.moreStill === true).length > 0,
    ).length > 0
  );
};

export function generateVerseNoteGroups(verseNotea?: VerseNote[]) {
  const s = verseNotea?.map((vN) => {
    generateVerseNoteGroup(vN);
  });

  return of(s);
}

function findAllGrpsWithName(
  name: string,
  grp: FormatGroup,
): Observable<FormatGroup> {
  if (grp.name && grp.name.toLowerCase() === name) {
    return of(grp);
  } else if (Array.isArray(grp.grps)) {
    return of(
      grp.grps.map((grp) => findAllGrpsWithName(name, grp as FormatGroup)),
    ).pipe(
      flatMap((o) => o),
      flatMap$,
    );
  }

  return EMPTY;
}
function prepVideos(chapter: Chapter) {
  return findAllGrpsWithName('video', chapter.body).pipe(
    map((grp) => {
      return of(
        axios.get((grp.attrs as {})['src'] as string, { responseType: 'json' }),
      ).pipe(
        flatMap((o) => o),
        map((o) => {
          //
          return (o.data as VideoData.RootObject).renditions;
        }),
        flatMap((o) => o),
        find((o) => typeof o.src === 'string' && o.container === 'MP4'),
        map((source) => {
          if (source && grp.attrs) {
            grp.attrs['src'] = source.src;
          }
        }),
      );
    }),
    flatMap$,
    toArray(),
  );
}

const port = parseInt(process?.env?.PORT as string, 10) || 3000;

function addRefLabel(chapter: Chapter) {
  return of(
    appSettings && appSettings.noteCategories
      ? of(appSettings.noteCategories)
      : of(
          axios.get(
            `${parseSubdomain().storageURL}${'eng'}-${
              parseSubdomain().settings
            }${'noteCategories'}.json`,
            {
              responseType: 'json',
            },
          ),
        ).pipe(
          flatMap$,
          map((res) => res.data as NoteCategories),
        ),
  ).pipe(
    flatMap$,
    map((noteCategories) => {
      return chapter.verseNotes?.map((verseNote) => {
        verseNote.notes?.map((note) => {
          note.ref.map((ref) => {
            const cat =
              noteCategories && noteCategories.noteCategories
                ? noteCategories.noteCategories.find(
                    (c) => c.category === ref.category,
                  )
                : { label: 'err' };

            ref.label = `${
              cat ? cat.label.replace('â˜º', '🔊').replace('DCT', '🔍') : 'ERR'
            }\u00a0`;
          });
        });
      });
      // return of(chapter.verseNotes).pipe(
      //   filter(o => o !== undefined),
      //   flatMap(o => o as VerseNote[]),
      //   filter(o => Array.isArray(o.notes)),
      //   flatMap(o => o.notes as Note[]),
      //   filter(o => o !== undefined && Array.isArray(o.ref)),
      //   map(note => {
      //     note.ref.map(ref => {
      //       const cat =
      //         noteCategories && noteCategories.noteCategories
      //           ? noteCategories.noteCategories.find(
      //             c => c.category === ref.category,
      //           )
      //           : { label: 'err' };
      //       ref.label = `${
      //         cat ? cat.label.replace('â˜º', '🔊').replace('GEO', '🗺') : 'ERR'
      //         }\u00a0`;
      //     });
      //   }),
      // );
    }),
    // flatMap$,
    // toArray(),
  );
}

export function buildShell(chapter: Chapter, params: ChapterParams) {
  return forkJoin(
    generateVerseNoteGroups(chapter.verseNotes).pipe(
      map(() => buildFMerged(chapter)),
      flatMap((o) => o),
    ),
    addRefLabel(chapter),
    // prepVideos(chapter),
    of(highlightVerses(chapter.verses, params)),
  );
}

export declare type Params = {
  [key: string]: any;
};

export interface ChapterParams {
  book: string;
  chapter: string;
  highlight?: string;
  context?: string;
  lang: string;
  host: string;
}

export function parseChapterParams(
  params: Params,
  lang: string,
  host: string,
): ChapterParams {
  const book = params['book'] as string;
  const chapterSplit = (params['chapter'] as string).split('.');

  return {
    book: book,
    chapter: chapterSplit[0],
    highlight: chapterSplit[1],
    context: chapterSplit[2],
    lang: lang,
    host: host,
  };
}
