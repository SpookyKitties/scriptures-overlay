import { flatten, range, uniq, sortBy } from 'lodash';
import { Offset } from '../verse-notes/verse-note';
import { of, Observable } from 'rxjs';
import { filterUndefinedNull$ } from '../rx/argv$';
import {
  flatMap,
  map,
  toArray,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { flatMap$ } from '../rx/flatMap$';

export function expandOffsets(offsets: string) {
  if (offsets) {
    const off = offsets
      .replace(/\s/g, '')
      .split(',')
      .map(l => {
        const n = l.split('-');

        return n.length === 1 || n[0] === offsets[1]
          ? [parseInt(n[0])]
          : range(parseInt(n[0]), parseInt(n[1]) + 1);
      });
    return off;
  }
  return [[]];
}
export function expandOffsets$(offsets: Offset): Observable<number[]> {
  // (offsets.offsets )
  return of(offsets.offsets as string).pipe(
    filterUndefinedNull$,
    map(o => {
      const off = o
        .replace(/\s/g, '')
        .split(',')
        .map(l => {
          const n = l.split('-');

          return n.length === 1 || n[0] === o[1]
            ? [parseInt(n[0])]
            : range(parseInt(n[0]), parseInt(n[1]) + 1);
        });

      offsets.uncompressedOffsets = uniq(flatten(flatten(off))).sort(
        (a, b) => a - b,
      );
      return offsets.uncompressedOffsets;
    }),
  );
  // return of(offsets.offsets as string).pipe(
  // filterUndefinedNull$,
  // flatMap(o => o.replace(/\s/g, '').split(',')),
  // map(o => o.split('-')),
  // map(o =>
  // o.length === 1 || o[0] === o[1]
  // ? [parseInt(o[0])]
  // : range(parseInt(o[0]), parseInt(o[1]) + 1),
  // ),
  // flatMap$,
  // distinctUntilChanged(),
  // toArray(),
  // map(o => (offsets.uncompressedOffsets = o.sort((a, b) => a - b))),
  // );
}
export function compressRanges(array: number[]): [number, number][] {
  const ranges: [number, number][] = [];
  let rstart: number, rend: number;
  const sortedArray = uniq(
    sortBy(array, (u): number => {
      return u;
    }),
  );
  for (let i = 0; i < sortedArray.length; i++) {
    rstart = sortedArray[i];
    rend = rstart;
    while (sortedArray[i + 1] - sortedArray[i] === 1) {
      rend = sortedArray[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart === rend ? [rstart, rstart] : [rstart, rend]);
  }

  return ranges.filter((range): boolean => {
    // (typeof range[0]);
    return isNaN(range[0]) === false && isNaN(range[1]) === false;
  });
}

export function getRanges(array?: number[]): Observable<string> {
  if (!array) {
    return of('');
  }
  return of(array).pipe(
    filter(o => o !== undefined),
    map(o => compressRanges(o)),
    flatMap$,
    distinctUntilChanged(),
    map(o => {
      return o[0] === o[1] ? `${o[0]}` : o.join('-');
    }),
    toArray(),
    map(o => o.join(',')),
  );
}

export const getRanges$ = map((o: number[]) => getRanges(o));
