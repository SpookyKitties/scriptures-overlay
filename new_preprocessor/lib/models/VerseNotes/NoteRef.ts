export class NoteRef {
  public category?: number;
  public text?: string;
  public vis?: boolean;
  public label?: string;
  public moreStill?: boolean;
  public more?: boolean;
  public delete?: boolean;
  public tempValue?: string;
  public constructor(
    text: string,
    category?: number,
    moreStill?: boolean,
    more?: boolean,
  ) {
    this.moreStill = moreStill;
    this.more = more;
    this.category = category;

    this.text = text;
  }
}
