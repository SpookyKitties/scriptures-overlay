import { of, EMPTY } from 'rxjs';
import {
  filter,
  map,
  flatMap,
  toArray,
  bufferCount,
  mergeMap,
} from 'rxjs/operators';
import JSZip from 'jszip';
import { PouchyRx } from './PouchyRx';
import { Chapter } from '../../../oith-lib/src/models/Chapter';

export function querySelector<T extends HTMLElement>(selector: string) {
  return of(document.querySelector(selector) as T).pipe(
    filter(o => o !== null),
  );
}

export function unzip(file: File) {
  const unzip = async () => {
    const zip = await JSZip.loadAsync(file);
    const files = Object.keys(zip.files)
      .filter(n => n.endsWith('.json'))
      .map(async n => {
        try {
          return JSON.parse(await zip.file(n).async('text'));
        } catch (error) {
          return EMPTY;
        }
      });

    return Promise.all(files);
  };
  return of(unzip()).pipe(
    flatMap(o => {
      return o;
    }),
    map(o => {
      console.log(o);
      return o;
    }),
    flatMap(o => o),
  );
  return of(JSZip.loadAsync(file)).pipe(
    flatMap(o => o),
    map(zip => {
      return Object.keys(zip.files)
        .filter(n => n.endsWith('.json'))
        .map(async n => {
          try {
            return JSON.parse(await zip.file(n).async('text'));
          } catch (error) {
            return EMPTY;
          }
        });
    }),
    flatMap(o => o),
    flatMap(o => o),
    map(o => (Array.isArray(o) ? of(o as []).pipe(flatMap(o => o)) : of(o))),
    flatMap(o => o),
  );
}

const filterZipFiles = filter((file: File) => file.name.endsWith('.zip'));

export function importFiles(selector: string) {
  let database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);

  return querySelector<HTMLInputElement>(selector)
    .pipe(
      filter(o => o.files !== undefined && o.files !== null),
      map(inputElem => inputElem.files),
      flatMap(o => o),
      map(o => o),
      filterZipFiles,
      map(o => unzip(o)),
      flatMap(o => o),

      bufferCount(10),
      map((o: Chapter[]) => {
        console.log(o.filter(i => i.id === undefined));
        console.log(o.filter(i => i.id !== undefined));

        return database.bulkDocs$(o, 'id');
      }),
    )
    .pipe(flatMap(o => o));
}
