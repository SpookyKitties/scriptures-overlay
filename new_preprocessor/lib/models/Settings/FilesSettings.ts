export class FilesSettings {
  public overlayFiles: string[];
  public scripturesArchive: string;

  public constructor(overlayFiles: string[], scripturesArchive: string) {
    this.overlayFiles = overlayFiles;
    this.scripturesArchive = scripturesArchive;
  }
}
