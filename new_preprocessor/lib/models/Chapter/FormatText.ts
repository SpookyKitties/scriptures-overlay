import { Offsets } from '../VerseNotes/Offsets';
import { DocType } from "./DocType";
import { FormatMerged } from "./FormatMerged";


export class FormatText implements Offsets {
    public offsets?: string | undefined;
    public uncompressedOffsets?: number[] | undefined;
    public docType: DocType = DocType.FORMATTEXT;
    public formatMerged?: FormatMerged[];
}
