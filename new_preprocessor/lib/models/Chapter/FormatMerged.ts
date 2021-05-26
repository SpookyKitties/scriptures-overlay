import { FormatTag } from '../VerseNotes/FormatTag';


export class FormatMerged {
    public text: string;
    public formatTags: FormatTag[];
    public underline?: boolean;
    public doubleUnderline?: boolean;
    public highlight?: boolean;
    public all?: boolean;
    public offset: number;
    public constructor(text: string, formatTags: FormatTag[], offset: number) {
        this.text = text;
        this.formatTags = formatTags;
        this.offset = offset;
    }
}
