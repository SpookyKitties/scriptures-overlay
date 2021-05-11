import { expandOffsets$, getRanges$ } from './expandOffsets';
import { map } from 'rxjs/operators';
import { flatMap$ } from '../main';
import { of } from 'rxjs';

const offsets1 = '1-10';
const offset1Uncompressed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const offsets2 = '1-1 0,90-100 ';
const offsets2Uncompressed = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  90,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98,
  99,
  100,
];

const offsets3 = '1';
const offsets3Uncompressed = [1];

test('Offsets Group 1', async () => {
  expect(await expandOffsets$({ offsets: offsets1 }).toPromise()).toEqual(
    offset1Uncompressed,
  );
});

test('Offsets Group 2 ', async () => {
  expect(await expandOffsets$({ offsets: offsets2 }).toPromise()).toEqual(
    offsets2Uncompressed,
  );
  expect(
    await of(offsets2Uncompressed)
      .pipe(getRanges$, flatMap$)
      .toPromise(),
  ).toEqual(offsets2.replace(/\s/g, ''));
});

test('Expans to 1', async () => {
  expect(await expandOffsets$({ offsets: '1' }).toPromise()).toEqual([1]);
});
test('Expans to 1', async () => {
  expect(
    await expandOffsets$({ offsets: '1' })
      .pipe(getRanges$, flatMap$)
      .toPromise(),
  ).toEqual('1');
});
