import Router from 'next/router';
import { appSettings, store } from './SettingsComponent';
import { filter, map, flatMap, take, toArray, delay } from 'rxjs/operators';
import { forkJoin, of, Observable, EMPTY } from 'rxjs';
// import { filterUndefined$ } from '../oith-lib/src/process';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { NavigationItem } from './navigation-item';
// import { getURL } from 'next/dist/next-server/lib/utils';

export const filterUndefined$ = filter(
  <T>(o: T) => o !== undefined && o !== null,
);
export function getNav() {
  return appSettings.flatNavigation$.pipe(
    filter((o) => o !== undefined),
    map((ni) => {
      return ni.filter((n) => n.href !== undefined);
    }),
  );
}

function checkDisabled() {
  return store.disableNav$.pipe(
    take(1),
    filter((o) => o === false),
  );
}

export function previousPage() {
  if (store) {
    checkDisabled().subscribe(() => {
      const url = parseUrl();
      if (url) {
        getNav().subscribe((o) => {
          const n = o.find((n) => n.href === url);
          if (n) {
            store.history = false;
            const i = o[o.indexOf(n) - 1];
            Router.push('/[book]/[chapter]', `/${i.href}`);
          }
        });
      }
    });
  }
}
export function nextPage() {
  if (store) {
    const chapterLoadElement = document.querySelector('.verse-notes');
    // console.log(chapterLoadElement.scrollTop);

    checkDisabled().subscribe(() => {
      const url = parseUrl();
      if (url) {
        getNav().subscribe((o) => {
          const n = o.find((n) => n.href === url);

          if (n) {
            store.history = false;

            const i = o[o.indexOf(n) + 1];
            Router.push('/[book]/[chapter]', `/${i.href}`);
          }
        });
      }
    });
  }
}
function parseUrl() {
  const href = window.location.href.split('.');

  const urlRegex = /(^http.*\/)(.+?)(\/)(.+?)(\.|\?|$)/g.exec(
    window.location.href,
  );

  return urlRegex ? `${urlRegex[2]}/${urlRegex[4]}` : undefined;
}

function navUPdate(
  navigationItem: NavigationItem,
  url: string,
): Observable<NavigationItem[]> {
  const n = navigationItem.navigationItems
    ? navigationItem.navigationItems.find((ni) => `/${ni.href}` === url)
    : undefined;

  if (navigationItem.navigationItems !== undefined && n) {
    n.open = true;

    return of([navigationItem]); //.pipe(map(o=>o.concat()));
  } else if (navigationItem.navigationItems !== undefined) {
    return of(navigationItem.navigationItems).pipe(
      flatMap$,
      map((o) =>
        navUPdate(o, url).pipe(map((o) => o.concat([navigationItem]))),
      ),
      flatMap$,
    );
  }

  return EMPTY; // of(navigationItem).pipe()
}
// export const filterUndefined<T> = () => filter((o: T) => o !== undefined); //=>{}
export function initnav() {
  store.chapter
    .pipe(
      take(1),
      filterUndefined$,
      delay(10),
      map((c) => {
        return resetNav();
      }),
      // flatMap$,
      flatMap((o) => o),
      flatMap((o) => o),
    )
    .subscribe((o) => {
      o.map((i) => (i.open = true));

      appSettings.updatenavigation$.next(true);
    });
}
export function setCurrentNav() {
  store.chapter
    .pipe(
      filterUndefined$,
      delay(10),
      map((c) => {
        return resetNav();
      }),
      // flatMap$,
      flatMap((o) => o),
      flatMap((o) => o),
    )
    .subscribe((o) => {
      o.map((i) => (i.open = true));

      appSettings.updatenavigation$.next(true);
    });
}
export function resetNav(): Observable<Observable<NavigationItem[]>> {
  const resetFlatNav = () => {
    return appSettings.flatNavigation$.pipe(
      take(1),
      map((nav) => {
        return nav.map((n) => (n.open = false));
      }),
    );
  };
  return forkJoin(
    appSettings.navigation$.pipe(
      take(1),
      filter((o) => o !== undefined),
    ),
    resetFlatNav(),
  ).pipe(map((o) => navUPdate(o[0], `/${parseUrl()}`)));
}

export function urlFromID(
  id: string, // import('c:/users/jared/source/repos/scriptures-overlay/oith-lib/src/models/Chapter').Chapter,
) {
  const idreg = /^.+?\-(.+?)\-chapter/g.exec(id);
  if (idreg) {
    const book = /(.+)\-(.+$)/g.exec(idreg[1]);

    return book ? `/${book[1]}/${book[2]}` : '';
  }
  return id;
}
