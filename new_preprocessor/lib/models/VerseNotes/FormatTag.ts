import { Formating } from './Formating';
import { FormatTagType } from './FormatTagType';


export class FormatTag extends Formating {
  public id?: string;
  public pronunciation?: boolean;
  public constructor(
    formatType: FormatTagType,
    offsets: string,
    uncompressedOffsets?: number[]
  ) {
    super(formatType, offsets);
    this.uncompressedOffsets = uncompressedOffsets;
  }
}
