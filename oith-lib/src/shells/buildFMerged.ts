import { isEqual } from 'lodash';
import { EMPTY, Observable, firstValueFrom, forkJoin, of } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';
import {
  Chapter,
  FormatGroup,
  FormatMerged,
  FormatText,
  Verse,
} from '../models/Chapter';
import { expandOffsets$ } from '../offsets/expandOffsets';
import { flatMap$ } from '../rx/flatMap$';
import { FormatTag, VerseNote } from '../verse-notes/verse-note';

export function expandNoteOffsets(verseNote?: VerseNote) {
  if (verseNote && verseNote.notes) {
    if (verseNote.noteGroups) {
      return of(
        verseNote.noteGroups
          .filter((ng) => !ng.delete)
          .map((ng) =>
            forkJoin(expandOffsets$(ng.formatTag), of(ng.formatTag)).pipe(
              map((o) => o[1]),
            ),
          ),
      ).pipe(flatMap$, flatMap$);
    }
  }

  return EMPTY;
}

export function extractFormatText(
  verse: FormatGroup | Verse | FormatText,
): Observable<FormatText> {
  // console.log((verse as FormatText)?.docType);

  if (Array.isArray((verse as FormatGroup | Verse).grps)) {
    return of(
      (verse as FormatGroup | Verse).grps as (FormatGroup | FormatText)[],
    ).pipe(
      flatMap$,
      map((o) => extractFormatText(o)),
      flatMap$,
    );
  } else if ((verse as FormatText).docType === 5) {
    // console.log(verse);

    return of(verse as FormatText);
  }

  return EMPTY;
}
function objectsAreSame(x: any[], y: any[]) {
  var objectsAreSame = true;
  for (var propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
}

export function addTextToFormatText(
  verse: Verse,
  formatText: FormatText,
  formatTags?: FormatTag[],
) {
  // console.log(verse);
  if (formatText.offsets && !formatTags) {
    const split = formatText.offsets.split('-');

    return of(
      (formatText.formatMerged = [
        new FormatMerged(
          verse.text.slice(parseInt(split[0], 10), parseInt(split[1], 10) + 1),
          [],
          parseInt(split[0], 10),
        ),
      ]),
    );
  } else if (formatText.uncompressedOffsets && formatTags) {
    const fMerged: { i: number[]; formatTags: FormatTag[] }[] = [];
    let last: { i: number[]; formatTags: FormatTag[] } | undefined = undefined;

    formatText.uncompressedOffsets.map((u) => {
      const ft = formatTags.filter(
        (o) =>
          (o.uncompressedOffsets && o.uncompressedOffsets.includes(u)) ||
          o.offsets === 'all',
      );

      if (!last) {
        last = { i: [u], formatTags: ft };
        fMerged.push(last);
      } else {
        if (isEqual(ft, last.formatTags)) {
          //objectsAreSame(ft, last.formatTags)) {
          // console.log(`${ft.length} ${last.formatTags.length}`);
          // console.log();

          last.i.push(u);
        } else {
          last = { i: [u], formatTags: ft };
          fMerged.push(last);
        }
      }
    });
    const s = (formatText.formatMerged = fMerged.map((f) => {
      return new FormatMerged(
        verse.text.slice(f.i[0], f.i[f.i.length - 1] + 1),
        f.formatTags,
        f.i[0],
      );
    }));
    return of(s);
  }

  return EMPTY;
}

export function resetVerse(verse: Verse, formatTags?: FormatTag[]) {
  // const asdf = async () => {
  //   const fmtTxts = await extractFormatText(verse)
  //     .pipe(toArray())
  //     .toPromise();
  //   return Promise.all(
  //     fmtTxts.map(fmtTxt => {
  //       return expandOffsets(fmtTxt)
  //         .pipe(
  //           map(() => addTextToFormatText(verse, fmtTxt, formatTags)),
  //           flatMap(o => o),
  //         )
  //         .toPromise();
  //     }),
  //   );
  // };
  // return of(asdf()).pipe(flatMap(o => o));
  // console.log(verse);

  return extractFormatText(verse).pipe(
    map((o: FormatText) => {
      return expandOffsets$(o).pipe(
        map(() => addTextToFormatText(verse, o, formatTags)),
        flatMap$,
      );
    }),
    flatMap((o) => o),
    toArray(),
  );
}

export async function buildVerseFMerged(chapter: Chapter, verse: Verse) {
  const verseNote = chapter.verseNotes?.find((vN) =>
    vN.id.includes(`-${verse.id}-verse-note`),
  );

  await firstValueFrom(
    expandNoteOffsets(verseNote).pipe(
      toArray(),
      map((formatTags) => resetVerse(verse, formatTags)),
      flatMap$,
    ),
  );
}

export function buildFMerged(chapter: Chapter) {
  const t = chapter.verses.map(async (verse) => {
    await buildVerseFMerged(chapter, verse);
    if (chapter.verseNotes) {
    }
  });
  return of(Promise.all(t)).pipe(flatMap((o) => o));
}
