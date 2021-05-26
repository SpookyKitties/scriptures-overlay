import { expandOffsets } from '../offsets/expandOffsets';
import { FormatTag } from './FormatTag';
import { FormatTagType } from './FormatTagType';
import { Note } from './Note';


export class FormatTagNoteOffsets extends FormatTag {
  public id: string;
  public fType = FormatTagType.NOTEOFFSETS;
  public highlight?: boolean;
  public noteGroupID: string;
  public uncompressedOffsets?: number[];
  public notes: Note[];
  public constructor(
    offsets: string,
    id: string,
    noteGroupID: string,
    notes: Note[],
    fType?: FormatTagType
  ) {
    super(FormatTagType.NOTEOFFSETS, offsets);
    this.noteGroupID = noteGroupID;
    this.id = id;
    this.notes = notes;

    if (fType) {
      this.fType = fType;
    }

    expandOffsets(this);
  }
}
