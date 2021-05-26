import { flatten, range, uniq } from 'lodash';
import { Offset } from "../VerseNotes/Offset";

export function expandOffsets(offsets: Offset): number[] {
  // (offsets.offsets )
  if (offsets.offsets) {
    const off = offsets.offsets
      .replace(/\s/g, '')
      .split(',')
      .map((l) => {
        const n = l.split('-');

        return n.length === 1 || n[0] === (offsets.offsets as string)[1]
          ? [parseInt(n[0])]
          : range(parseInt(n[0]), parseInt(n[1]) + 1);
      });

    offsets.uncompressedOffsets = uniq(flatten(flatten(off))).sort(
      (a, b) => a - b,
    );
    return offsets.uncompressedOffsets;
  }

  return [];
}
