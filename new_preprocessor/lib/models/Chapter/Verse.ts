import { VerseNote } from '../VerseNotes/VerseNote';
import { FormatGroup } from './FormatGroup';

export class Verse {
    public id: string;
    public text: string;
    public n: string;
    public highlight?: boolean;
    public context?: boolean;

    public grps: FormatGroup[];
    public attrs: {};
    public verseNote?: VerseNote;
    public focused?: boolean;
    public constructor(
        id: string,
        text: string,
        formatGroups: FormatGroup[],
        n: string,
        attrs: {}
    ) {
        this.id = id;
        this.text = text;
        this.grps = formatGroups;
        this.n = n;
        this.attrs = attrs;
    }
}
