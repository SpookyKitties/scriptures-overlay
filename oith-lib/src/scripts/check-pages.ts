import { of, forkJoin } from 'rxjs';
import { argv } from 'yargs';
import { filter, map, flatMap, toArray } from 'rxjs/operators';
import normalizePath from 'normalize-path';
import * as FastGlob from 'fast-glob';
import { readFile } from 'fs-extra';
import { JSDOM } from 'jsdom';

export function main() {
  return of(argv['i'] as string)
    .pipe(
      filter((o) => o !== undefined),
      map((i) => FastGlob.default(normalizePath(`${i}/**/**`))),
      flatMap((o) => o),
      flatMap((o) => o),
      map((fileName) =>
        of(readFile(normalizePath(fileName))).pipe(
          flatMap((o) => o),
          map((o) => {
            const doc = new JSDOM(o).window.document;

            return forkJoin(
              of(fileName),
              of(doc.querySelector('header') !== null),
              of(doc.querySelector('.body-block') !== null),
            ).pipe(
              filter((o) => o[1] === false && o[2] === false), // || o[1] !== o[2])
            );
          }),
          flatMap((o) => o),
          map((o) => o),
        ),
      ),
      flatMap((o) => o),
    )
    .subscribe();
}

main();
