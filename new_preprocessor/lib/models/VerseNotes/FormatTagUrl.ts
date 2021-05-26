import { FormatTagHighlight } from './FormatTagHighlight';
import { FormatTagType } from './FormatTagType';


export class FormatTagUrl extends FormatTagHighlight {
  public url: string;
  public constructor(formatType: FormatTagType, url: string, offsets: string) {
    super(formatType, offsets);
    this.url = url;
  }
}
