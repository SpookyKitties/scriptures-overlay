export class NoteSettingNew {
  public display: boolean;
  public enabled: boolean;
  public label: string;
  public overlays: string[];
  public categoriesOn: string[];
  public constructor(
    display: boolean,
    enabled: boolean,
    label: string,
    categoriesOn?: string[],
    overlays?: string[],
  ) {
    this.display = display;
    this.enabled = enabled;
    this.label = label;
    this.overlays = overlays ? overlays : [];
    this.categoriesOn = categoriesOn ? categoriesOn : [];
  }
}
