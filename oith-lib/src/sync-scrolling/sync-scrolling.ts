import { of, Subject, forkJoin } from 'rxjs';
import { map, take, flatMap } from 'rxjs/operators';
import { store } from '../../../components/SettingsComponent';

export const syncScrolling$ = new Subject();

function syncScrolling() {
  syncScrolling$
    .pipe(
      map(() => store.chapter.pipe(take(1))),
      flatMap((o) => o),
      map((chapter) => {
        console.log(chapter);

        const verses = Array.from(document.querySelectorAll('.verse'));
        const chapterElement = document.querySelector('.chapter-loader');
        if (chapterElement) {
          const y = chapterElement.getBoundingClientRect().top;
          const verse = verses.find(
            (e) => e.getBoundingClientRect().top + 10 >= y + 10 === true,
          );
          console.log(verse);

          if (verse) {
            const verseNote = document.querySelector(
              `[id*='-${verse.id}-verse-note']`,
            );

            if (verseNote) {
              verseNote.scrollIntoView();
            }
          }
        }
      }),
    )
    .subscribe();
}

syncScrolling();
