import { of, forkJoin } from 'rxjs';
import { filter, map, take, flatMap, takeLast, first } from 'rxjs/operators';
import { store } from './SettingsComponent';
import { Chapter } from '../oith-lib/src/models/Chapter';
export function scrollIntoView(chapter?: Chapter) {
  const c$ = chapter ? of(chapter) : store.chapter.pipe(first());
  return c$.pipe(
    // first(),
    filter(o => o !== undefined),
    map(c => {
      if (c && c.params && c.params.highlight && !c.history) {
        return of(document.querySelector('.highlight,.context')).pipe(
          filter(o => o !== null),
          map(o => o.scrollIntoView()),
        );
      }

      const vns = (sel: string, top: number) => {
        const e = document.querySelector(sel);
        console.log(top);

        if (e) {
          e.scrollTop = top;
        }
      };

      return forkJoin(
        of(vns('.verse-notes', store.history ? c.verseNotesTop : 0)),
        of(vns('.chapter-loader', store.history ? c.chapterTop : 0)),
      );
      return of(document.querySelector('.chapter-loader')).pipe(
        filter(o => o !== null),
        map(o => {
          o.scrollTop = store.history ? c.chapterTop : 0;
        }),
      );
      // .subscribe();
    }),
    flatMap(o => o),
  );
}
