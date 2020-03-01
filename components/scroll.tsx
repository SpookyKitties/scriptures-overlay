import { filter, map, take, debounceTime, flatMap } from 'rxjs/operators';
import { store } from './SettingsComponent';
import { syncedVerse } from './mobile-notes.tsx/MobileNotesComponent';
import { Subject, EMPTY } from 'rxjs';

function resetVerseFocus() {
  Array.from(document.querySelectorAll('.verse.focused')).map(v =>
    v.classList.remove('focused'),
  );
}

function setVerseFocus(verseID: string) {
  const verseElem = document.querySelector(
    `.body-block .verse[id="${verseID}"]`,
  );

  if (verseElem) {
    verseElem.classList.add('focused');
  }
}
export function scrollTop(selector: string, count: number) {
  const elem = document.querySelector(selector);
  if (elem) {
    elem.scrollTop = elem.scrollTop + count;
  }
}
const syncScrolling = new Subject<void>();

syncScrolling
  .pipe(
    map(() => {
      const verses = Array.from(document.querySelectorAll('.verse'));
      const chapterElement = document.querySelector('.chapter-loader');
      if (chapterElement) {
        const y = chapterElement.getBoundingClientRect().top;
        const verse = verses.find(
          e => e.getBoundingClientRect().bottom - 45 >= y === true,
        ) as Element;

        if (verse) {
          return store.chapter.pipe(
            take(1),
            filter(o => o !== undefined),
            map(chapter => {
              resetVerseFocus();
              const tempID = /^(p)(.+)$/g.exec(verse.id);
              const id = tempID ? tempID[2] : verse.id;

              const vn = chapter.verseNotes.find(vn =>
                vn.id.includes(`-${id}-verse-note`),
              );
              if (syncedVerse) {
                setVerseFocus(verse.id);
                syncedVerse.next(vn);
              }
              return id;
            }),
          );
          // .subscribe();
        }
      }
      return EMPTY;
    }),
    flatMap(o => o),
  )
  .subscribe(id => {
    const verseNote = document.querySelector(`[id*='-${id}-verse-note']`);
    if (verseNote) {
      verseNote.scrollIntoView();
      // scrollTop('.verse-notes', -48);
    }
  });

export function scroll() {
  syncScrolling.next();
}
