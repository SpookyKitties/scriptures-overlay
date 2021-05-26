import { FormatTagType } from './FormatTagType';


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
