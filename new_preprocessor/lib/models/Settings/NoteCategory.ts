export class NoteCategoryNew {
  public name: string;
  public label: string;
  public className: string;
  public on: string[];
  public off: string[];
  public category: number;

  public constructor(
    name: string,
    label: string,
    className: string,
    on: string[],
    off: string[],
    category: number,
  ) {
    this.name = name;
    this.label = label;
    this.className = className;
    this.on = on;
    this.off = off;
    this.category = category;
  }
}
