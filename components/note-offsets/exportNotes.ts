import { of } from 'rxjs';
import { filter, map, flatMap, toArray, take } from 'rxjs/operators';
import { appSettings, store } from '../SettingsComponent';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import { Note, NoteRef } from '../../oith-lib/src/verse-notes/verse-note';
import { NoteType } from '../../oith-lib/src/verse-notes/settings/note-gorup-settings';
import FileSaver from 'file-saver';
import { first, orderBy, sortBy } from 'lodash';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import { NavigationItem } from '../navigation-item';

function noteRefsToString(noteRefs: NoteRef[]) {
  return noteRefs.map(noteRef => {
    const noteCategory = appSettings.noteCategories.noteCategories.find(
      nc => nc.category === noteRef.category,
    );
    if (noteCategory) {
      return `<p class="note-reference"><span class="${noteCategory.className}">${noteCategory.name} </span>${noteRef.text}</p>`;
    }
  });
}

function notesToString(note: Note, noteTypes: NoteType[]) {
  const noteType = noteTypes.find(
    noteType => noteType.noteType === note.noteType,
  );
  if (noteType) {
    return `<note class="${noteType.className}" id="${note.id}" offsets="${
      note.formatTag.offsets
    }"><p class="note-phrase">${note.phrase}</p>${noteRefsToString(
      note.ref,
    ).join('')}</note>`;
  }
}

function verseNotesFromShell(chapter: Chapter) {
  const verseNotes = chapter.verses
    .map(verse =>
      chapter.verseNotes
        ? chapter.verseNotes.find(vN =>
            vN.id.includes(`-${verse.id}-verse-notes`),
          )
        : undefined,
    )
    .filter(vN => vN !== undefined);
  return verseNotes;
}
const docstart = (id: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><html data-content-type="overlay-note" lang="eng"><head><meta charset="UTF-8"/></head><body>`;
const docend = `</body></html>`;
export function exportNotes() {
  return newExportNotes();
}

function getBooksChapters() {
  return store.chapter.pipe(
    take(1),
    filter(o => o !== undefined),
    map(chapter => {
      const getChapters = async () => {
        const lang = chapter.id.split('-')[0] as string;

        const chapters = await store.database
          .allDocs$()
          .pipe(
            map(o => {
              return o.rows
                .filter(r =>
                  r.id.startsWith(`${lang}-${location.pathname.split('/')[1]}`),
                )
                .map(c => {
                  return { id: c.id, rev: c.value.rev };
                });
            }),
          )
          .toPromise();

        return (await store.database.bulkGet$({ docs: chapters })) as Chapter[];
      };

      return of(getChapters()).pipe(flatMap$);
    }),
    flatMap$,
  );
}

const chapterTxt = (chapter: Chapter, noteTypes: NoteType[]) => {
  return `<chapter id="${chapter.id}">${verseNotesFromShell(chapter)
    .map(verseNote => {
      return `<verse-notes id="${verseNote.id}">${verseNote.notes
        .map(note => notesToString(note, noteTypes))
        .join('')}</verse-notes>`;
    })
    .join('')}</chapter>`;
};

function buildFileName() {
  const overlays = Array.from(document.querySelectorAll('.checked-overlay'))
    .map(chkBox => {
      const className = first(
        chkBox.className.split(' ').filter(cN => cN.startsWith('overlay')),
      );
      return className.replace('overlay-', '').replace('-note', '');
    })
    .join('-');
  return `overlay-${overlays}-${location.pathname.split('/')[1]}-offsets.html`;
}

function findSort(flatNav: NavigationItem[], chapter: Chapter) {
  const navItem = flatNav.find(nav => {
    const navID = nav.href?.replace('/', '-');
    return chapter.id.includes(`-${navID}-`);
  });
  (chapter as any).sort = flatNav.indexOf(navItem);
}

const sortChapters = map((chapters: Chapter[]) => {
  return appSettings.flatNavigation$.pipe(
    map(flatNav => {
      chapters.map(chapter => findSort(flatNav, chapter));

      return sortBy(chapters, chapter => (chapter as any).sort);
    }),
  );
});

export function newExportNotes() {
  return of(document.querySelectorAll('.checked-overlay'))
    .pipe(
      flatMap(o => o),
      map(o => o.className.split(' ')),
      flatMap$,
      filter(o => o.startsWith('overlay')),
      map(o =>
        appSettings.noteTypes.noteTypes.find(
          noteType => noteType.className === o,
        ),
      ),
      filter(o => o !== undefined),
      toArray(),
      map(async noteTypes => {
        return getBooksChapters().pipe(
          sortChapters,
          flatMap$,
          map(chapters => {
            const chaptersTxt = chapters.map(chapter => {
              if (chapter.verseNotes) {
                return chapterTxt(chapter, noteTypes);
              }
              return '';
            });

            const fileTxt = `${docstart('id')}${chaptersTxt.join('')}${docend}`;
            const blob = new Blob([fileTxt], {
              type: 'text/html;charset=utf=8',
            });
            const fileName = buildFileName();
            console.log(fileName);

            FileSaver.saveAs(blob, fileName);
            return fileTxt;
          }),
        );
      }),
      flatMap(o => o),
    )
    .pipe(flatMap(o => o));
}
