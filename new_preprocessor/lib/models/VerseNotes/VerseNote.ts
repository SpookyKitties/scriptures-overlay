import { Note } from './Note';
import { VerseNoteGroup } from './VerseNoteGroup';
import { FormatTagHighlight } from './FormatTagHighlight';

export class VerseNote {
  public id: string;
  public _rev?: string;
  // public docType = DocType.VERSENOTE;
  public verseNoteGroups?: VerseNoteGroup[];
  public notes?: Note[];
  public props?: FormatTagHighlight[];
  public vis?: boolean;
  public noteGroups?: VerseNoteGroup[];

  public constructor(id: string, notes: Note[]) {
    this.id = id;

    this.notes = notes;
  }
}
