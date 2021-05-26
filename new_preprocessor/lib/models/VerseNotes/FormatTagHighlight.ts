import { Formating } from './Formating';
import { FormatTagType } from './FormatTagType';


export class FormatTagHighlight extends Formating {
  // public note
  public highlight?: boolean;
  public speak?: string;
  public url?: string;
  public constructor(
    formatType: FormatTagType,
    offsets: string,
    url?: string,
    speak?: string
  ) {
    super(formatType, offsets);

    this.speak = speak;
    this.url = url;
  }
}
