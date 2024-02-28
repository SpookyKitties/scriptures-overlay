import cuid from 'cuid';
import { Subject } from 'rxjs';
import { expandOffsets$ } from '../offsets/expandOffsets';
// import { NoteCategory } from './settings/note-gorup-settings';

export enum DocType {
  VERSENOTE,
  NOTE,
  CHAPTER,
  VERSE,
  FORMATGROUP,
  FORMATTEXT,
}
export class Doc {
  public id: string;
  public docType: DocType;
  public constructor(id: string, docType: DocType) {
    this.id = id;
    this.docType = docType;
  }
}

export class NoteRef {
  public category?: number;
  public text?: string;
  public vis?: boolean;
  public label: string;
  public moreStill?: boolean;
  public more?: boolean;
  public delete?: boolean;
  public tempValue?: string;
  public tempCategory?: number;
  public constructor(
    noteC: number,
    text: string,
    moreStill?: boolean,
    more?: boolean,
  ) {
    this.moreStill = moreStill;
    this.more = more;
    this.category = noteC;
    this.text = text;
  }
}

export class Note extends Doc {
  public _rev?: string;
  // public id: string;
  public formatTag: FormatTagHighlight;
  public href?: string;
  public phrase: string;
  public ref: NoteRef[];
  public speak?: string;
  public noteType: number;
  public sup?: string;
  public num?: string;
  public lSup?: string;
  public delete?: boolean;
  public oPhrase: string;
  public verseMarker: string;
  public noteMarker: string;
  public sourceID?: string;
  // public docType: DocType = DocType.NOTE;
  public constructor(
    vid: string,
    noteRefs: NoteRef[],
    noteType: number,
    notePhrase: string,
    offsets: string,
    url?: string,
    speak?: string,
  ) {
    super(vid, DocType.NOTE);
    // this.id = vid;
    this.phrase = notePhrase;
    this.oPhrase = notePhrase;
    this.ref = noteRefs;
    this.noteType = noteType;
    this.formatTag = {
      fType: FormatTagType.NOTEOFFSETS,
      offsets: offsets,
      url: url,
      speak: speak,
    };
  }
}

export class VerseNoteGroup {
  public delete: boolean;
  public id: string;
  public formatTag: FormatTagNoteOffsets;
  public noteGroupID = cuid();
  public notePhrase: string;
  public sup?: string;

  public notes: Note[] = [];
  public offsets: string;
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
    hasMoreStill?: boolean,
  ) {
    // this.offsets =
    // note.formatTag.offsets && note.formatTag.offsets !== ''
    // ? note.formatTag.offsets
    // : '100000';
    this.id = id;
    this.sup = sup;
    this.lSup = lSup;

    this.hasMoreStill = hasMoreStill;
    notes.filter((n) => n.formatTag.url);

    // this.notePhrase = note.phrase ? note.phrase : '';
    this.notes = notes;
    this.formatTag = new FormatTagNoteOffsets(
      notes[0].formatTag.offsets ? notes[0].formatTag.offsets : '',
      '',
      cuid(),
      notes,
    );
    // this.formatTag = {
    //   fType: FormatTagType.NOTEOFFSETS,
    //   offsets: notes[0].formatTag.offsets,
    //   id: '',
    //   noteGroupID: cuid(),
    //   uncompressedOffsets: undefined,
    //   h: new Subject(),
    // };
  }
}

export class VerseNote extends Doc {
  public id: string;
  public _rev?: string;
  // public docType = DocType.VERSENOTE;
  public grps?: VerseNoteGroup[];
  public notes?: Note[];
  public props?: FormatTagHighlight[];
  public vis?: boolean;
  public noteGroups?: VerseNoteGroup[];

  public constructor(id: string, notes: Note[]) {
    super(id, DocType.VERSENOTE);
    this.id = id;

    this.notes = notes;
  }
}

export enum FormatTagType {
  VERSENUMBER = 0,
  ITALIC,
  BOLD,
  SUBORDINATE,
  CLARITYWORD,
  TRANSLIT,
  LANGUAGE,
  DEITYNAME,
  SMALLCAPS,
  UPPERCASE,
  ENTRY,
  CLOSING,
  SIGNATURE,
  SHORTTITLE,
  BREAK,
  SALUTATION,
  OFFICE,
  DATE,
  ADDRESSEE,
  ANSWER,
  QUESTION,
  SELAH,
  POETRY,
  PROSE,
  DOMINANT,
  UPPERCASEDEITYNAME,
  UNDERLINEYELLOW,
  UNDERLINEBLUE,
  UNDERLINEGREEN,
  UNDERLINERED,
  UNDERLINEPURPLE,
  UNDERLINEORANGE,
  UNDERLINEPINK,
  UNDERLINEGRAY,
  UNDERLINEBROWN,
  UNDERLINEDARKBLUE,
  HIGHLIGHTDARKBLUE,
  HIGHLIGHTBROWN,
  HIGHLIGHTGRAY,
  HIGHLIGHTPINK,
  HIGHLIGHTYELLOW,
  HIGHLIGHTORANGE,
  HIGHLIGHTBLUE,
  HIGHLIGHTPURPLE,
  HIGHLIGHTGREEN,
  HIGHLIGHTRED,
  REFSINGLE,
  REFMULTI,
  INSERTION,
  DELETION,
  NOTE,
  GEOGRAPHY,
  PRONUNCIATION,
  PARAMARK,
  EM,
  NOTEOFFSETS,
  NOTEOFFSETSPRONUNCIATION,
}
export class FormatTagTypeSetting {
  public className: string;
  public formatTagType: FormatTagType;
}
export const FORMATTAGTYPESETTINGS: FormatTagTypeSetting[] = [
  {
    className: 'verse-number',
    formatTagType: FormatTagType.VERSENUMBER,
  },
  {
    className: 'italic',

    formatTagType: FormatTagType.ITALIC,
  },
  {
    className: 'bold',

    formatTagType: FormatTagType.BOLD,
  },
  {
    className: 'subordinate',

    formatTagType: FormatTagType.SUBORDINATE,
  },
  {
    className: 'clarity-word',

    formatTagType: FormatTagType.CLARITYWORD,
  },
  {
    className: 'translit',

    formatTagType: FormatTagType.TRANSLIT,
  },
  {
    className: 'language',

    formatTagType: FormatTagType.LANGUAGE,
  },
  {
    className: 'deity-name',

    formatTagType: FormatTagType.DEITYNAME,
  },
  {
    className: 'small-caps',

    formatTagType: FormatTagType.SMALLCAPS,
  },
  {
    className: 'uppercase',

    formatTagType: FormatTagType.UPPERCASE,
  },
  {
    className: 'entry',

    formatTagType: FormatTagType.ENTRY,
  },
  {
    className: 'closing',

    formatTagType: FormatTagType.CLOSING,
  },
  {
    className: 'signature',

    formatTagType: FormatTagType.SIGNATURE,
  },
  {
    className: 'shorttitle',

    formatTagType: FormatTagType.SHORTTITLE,
  },
  {
    className: 'salutation',

    formatTagType: FormatTagType.SALUTATION,
  },
  {
    className: 'office',

    formatTagType: FormatTagType.OFFICE,
  },
  {
    className: 'date',

    formatTagType: FormatTagType.DATE,
  },
  {
    className: 'addressee',

    formatTagType: FormatTagType.ADDRESSEE,
  },
  {
    className: 'answer',

    formatTagType: FormatTagType.ANSWER,
  },
  {
    className: 'question',

    formatTagType: FormatTagType.QUESTION,
  },
  {
    className: 'selah',

    formatTagType: FormatTagType.SELAH,
  },
  {
    className: 'dominant',

    formatTagType: FormatTagType.DOMINANT,
  },
  {
    className: 'uppercase-deityname',

    formatTagType: FormatTagType.UPPERCASEDEITYNAME,
  },
  {
    className: 'underline-yellow',

    formatTagType: FormatTagType.UNDERLINEYELLOW,
  },
  {
    className: 'underline-blue',

    formatTagType: FormatTagType.UNDERLINEBLUE,
  },
  {
    className: 'underline-green',

    formatTagType: FormatTagType.UNDERLINEGREEN,
  },
  {
    className: 'underline-red',

    formatTagType: FormatTagType.UNDERLINERED,
  },
  {
    className: 'underline-purple',

    formatTagType: FormatTagType.UNDERLINEPURPLE,
  },
  {
    className: 'underline-orange',

    formatTagType: FormatTagType.UNDERLINEORANGE,
  },
  {
    className: 'underline-pink',

    formatTagType: FormatTagType.UNDERLINEPINK,
  },
  {
    className: 'underline-gray',

    formatTagType: FormatTagType.UNDERLINEGRAY,
  },
  {
    className: 'underline-brown',

    formatTagType: FormatTagType.UNDERLINEBROWN,
  },
  {
    className: 'underline-darkblue',

    formatTagType: FormatTagType.UNDERLINEDARKBLUE,
  },
  {
    className: 'highlight-darkblue',

    formatTagType: FormatTagType.HIGHLIGHTDARKBLUE,
  },
  {
    className: 'highlight-brown',

    formatTagType: FormatTagType.HIGHLIGHTBROWN,
  },
  {
    className: 'highlight-gray',

    formatTagType: FormatTagType.HIGHLIGHTGRAY,
  },
  {
    className: 'highlight-pink',

    formatTagType: FormatTagType.HIGHLIGHTPINK,
  },
  {
    className: 'highlight-yellow',

    formatTagType: FormatTagType.HIGHLIGHTYELLOW,
  },
  {
    className: 'highlight-orange',

    formatTagType: FormatTagType.HIGHLIGHTORANGE,
  },
  {
    className: 'highlight-blue',

    formatTagType: FormatTagType.HIGHLIGHTBLUE,
  },
  {
    className: 'highlight-purple',

    formatTagType: FormatTagType.HIGHLIGHTPURPLE,
  },
  {
    className: 'highlight-green',

    formatTagType: FormatTagType.HIGHLIGHTGREEN,
  },
  {
    className: 'highlight-red',

    formatTagType: FormatTagType.HIGHLIGHTRED,
  },
  {
    className: 'refsingle',

    formatTagType: FormatTagType.REFSINGLE,
  },
  {
    className: 'refmulti',

    formatTagType: FormatTagType.REFMULTI,
  },
  {
    className: 'insertion',

    formatTagType: FormatTagType.INSERTION,
  },
  {
    className: 'deletion',

    formatTagType: FormatTagType.DELETION,
  },
  {
    className: 'note',

    formatTagType: FormatTagType.NOTE,
  },
  {
    className: 'geography',

    formatTagType: FormatTagType.GEOGRAPHY,
  },
  {
    className: 'pronunciation',

    formatTagType: FormatTagType.PRONUNCIATION,
  },

  {
    className: 'para-mark',

    formatTagType: FormatTagType.PARAMARK,
  },
  {
    className: 'i',

    formatTagType: FormatTagType.ITALIC,
  },
  {
    className: 'em',

    formatTagType: FormatTagType.EM,
  },
];

export abstract class Formating {
  public fType: FormatTagType;
  public offsets?: string;

  public uncompressedOffsets?: number[];
  public visible?: boolean;
  public constructor(formatType: FormatTagType, offsets: string) {
    this.fType = formatType;

    this.offsets = offsets;
  }
}

export class FormatTagHighlight extends Formating {
  // public note
  public highlight?: boolean;
  public speak?: string;
  public url?: string;
  public constructor(
    formatType: FormatTagType,
    offsets: string,
    url?: string,
    speak?: string,
  ) {
    super(formatType, offsets);

    this.speak = speak;
    this.url = url;
  }
}
export class FormatTag extends Formating {
  public id?: string;
  public pronunciation?: boolean;
  public constructor(
    formatType: FormatTagType,
    offsets: string,
    uncompressedOffsets?: number[],
  ) {
    super(formatType, offsets);
    this.uncompressedOffsets = uncompressedOffsets;
  }
}

export class FormatTagNoteOffsets extends FormatTag {
  public id: string;
  public fType = FormatTagType.NOTEOFFSETS;
  public highlight?: boolean;
  public h: Subject<boolean>;
  public noteGroupID: string;
  public uncompressedOffsets?: number[];
  public notes: Note[];
  public constructor(
    offsets: string,
    id: string,
    noteGroupID: string,
    notes: Note[],
    fType?: FormatTagType,
  ) {
    super(FormatTagType.NOTEOFFSETS, offsets);
    this.noteGroupID = noteGroupID;
    this.id = id;
    this.notes = notes;

    if (fType) {
      this.fType = fType;
    }
    // this.h = new Subject();

    expandOffsets$(this);
  }
}
export class FormatTagNotePronunciation extends FormatTagNoteOffsets {
  public fType = FormatTagType.NOTEOFFSETSPRONUNCIATION;
  public href?: string;
  public underline: boolean;
  public constructor(
    offsets: string,
    _id: string,
    noteGroupID: string,
    notes: Note[],
  ) {
    super(offsets, _id, offsets, notes, FormatTagType.NOTEOFFSETSPRONUNCIATION);
    this.noteGroupID = noteGroupID;
    this.id = _id;
    const note = notes.find((note) => note.href !== undefined);
    if (note) {
      this.href = note.href;
    }
    expandOffsets$(this);
  }
}

export class FormatTagUrl extends FormatTagHighlight {
  public url: string;
  public constructor(formatType: FormatTagType, url: string, offsets: string) {
    super(formatType, offsets);
    this.url = url;
  }
}

export interface Offset {
  offsets?: string;
  uncompressedOffsets?: number[];
  uncompressedOffsets2?: FirstLast[];
}

export interface FirstLast {
  first: number;
  last: number;
}

export class Offsets implements Offset {
  public id: string;
  public offsets?: string;
  public uncompressedOffsets?: number[];
}

export class OffsetGroup {
  // public _id: string;
  // public noteProperities?: NoteProperities;
  public phrase: string;
  public offsets?: Offsets[];
}
