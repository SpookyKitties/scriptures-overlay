import { FormatTagHighlight } from './FormatTagHighlight';
import { FormatTagType } from './FormatTagType';
import { NoteRef } from './NoteRef';

export class Note {
  public _rev?: string;
  public id: string;
  public formatTag: FormatTagHighlight;
  public href?: string;
  public phrase: string;
  public ref: NoteRef[];
  public speak?: string;
  public overlay?: number;
  public delete?: boolean;
  public oPhrase: string;
  public verseMarker: string;
  public noteMarker: string;
  public sourceID?: string;
  public constructor(
    vid: string,
    noteRefs: NoteRef[],
    offsets: string,
    verseMarker: string,
    noteMarker: string,
    overlay?: number,
    notePhrase?: string,
    url?: string,
    speak?: string,
    sourceID?: string,
  ) {
    this.id = vid;
    this.phrase = notePhrase ? notePhrase : '';
    this.oPhrase = notePhrase ? notePhrase : '';
    this.ref = noteRefs;
    this.overlay = overlay;
    this.verseMarker = verseMarker;
    this.noteMarker = noteMarker;
    this.formatTag = {
      fType: FormatTagType.NOTEOFFSETS,
      offsets: offsets,
      url: url,
      speak: speak,
    };
    this.sourceID = sourceID;
  }
}
