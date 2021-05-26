import { CategoryLabel } from './CategoryLabel';
import { GSTopic } from './GSTopic';
import { NoteMarker } from './NoteMarker';
import { NoteMarkerLocation } from './NoteMarkerLocation.1';
import { ScriptureBook } from './ScriptureBook';

export class Localization {
  public id: string;
  public lang: string;
  public noteMarkerLocation: NoteMarkerLocation;
  public noteMarkers: NoteMarker[];
  public leftQuoteMark: string;
  public rightQuoteMark: string;
  public ellipse: string;
  public categoryLabels: CategoryLabel[];
  public scriptureBooks: ScriptureBook[];
  public gsTopics: GSTopic[];

  public constructor(
    lang: string,
    noteMarkerLocation: NoteMarkerLocation,
    noteMarkers: NoteMarker[],
    leftQuoteMark: string,
    rightQuoteMark: string,
    ellipse: string,
    categoryLabels: CategoryLabel[],
    scriptureBooks: ScriptureBook[],
    gsTopics: GSTopic[],
  ) {
    this.id = `${lang}-localization`;
    this.lang = lang;
    this.noteMarkerLocation = noteMarkerLocation;
    this.noteMarkers = noteMarkers;
    this.leftQuoteMark = leftQuoteMark;
    this.rightQuoteMark = rightQuoteMark;
    this.ellipse = ellipse;
    this.categoryLabels = categoryLabels;
    this.scriptureBooks = scriptureBooks;
    this.gsTopics = gsTopics;
  }
}
