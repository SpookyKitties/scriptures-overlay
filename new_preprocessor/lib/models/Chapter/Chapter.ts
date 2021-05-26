/* eslint-disable @typescript-eslint/ban-types */
import { VerseNote } from '../VerseNotes/VerseNote';
import { ChapterParams } from './ChapterParams';
import { FormatGroup } from './FormatGroup';
import { Verse } from './Verse';

export class Chapter {
  public id: string;
  public _rev?: string | undefined;
  public lang: string;
  public shortTitle: string;
  public testament: string;
  public title: string;
  public body: FormatGroup;
  public sortVerseNotes?: VerseNote[];

  public verseNotes?: VerseNote[];
  public verses: Verse[];
  public params?: ChapterParams;
  public chapterTop?: number;
  public verseNotesTop?: number;
  history: any;
  public constructor(
    id: string,
    lang: string,
    title: string,
    shortTitle: string,
    testament: string,
    verses: Verse[],
    body: FormatGroup,
  ) {
    this.id = id;
    this.lang = lang;
    this.title = title;
    this.shortTitle = shortTitle;
    this.testament = testament;
    this.verses = verses.filter((verse) => verse.id !== '');
    this.body = body;
  }
}
