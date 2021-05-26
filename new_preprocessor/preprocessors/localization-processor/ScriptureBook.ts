export class ScriptureBook {
  public id: string;
  public abbr: string;
  public full: string;
  public constructor(id: string, abbr: string, full: string) {
    this.id = id;
    this.abbr = abbr;
    this.full = full;
  }
}
