import cuid from 'cuid';
import { Note } from './Note';
import { FormatTagNoteOffsets } from "./FormatTagNoteOffsets";


export class VerseNoteGroup {
  public delete?: boolean;
  public id: string;
  public formatTag: FormatTagNoteOffsets;
  public noteGroupID = cuid();
  public notePhrase?: string;
  public sup?: string;

  public notes: Note[] = [];
  public offsets?: string;
  public num?: string;
  public media?: boolean;
  public lSup?: string;
  public numVisible?: boolean;
  public hasMoreStill?: boolean;
  public showMoreStill?: boolean;

  public constructor(
    notes: Note[],
    id: string,
    sup?: string,
    lSup?: string,
    hasMoreStill?: boolean
  ) {
    this.id = id;
    this.sup = sup;
    this.lSup = lSup;

    this.hasMoreStill = hasMoreStill;
    notes.filter((n) => n.formatTag.url);

    this.notes = notes;
    this.formatTag = new FormatTagNoteOffsets(
      notes[0].formatTag.offsets ? notes[0].formatTag.offsets : '',
      '',
      cuid(),
      notes
    );
  }
}
