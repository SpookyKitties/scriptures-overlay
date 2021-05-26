import { AdditionalSetting } from './AdditionalSetting';
import { FilesSettings } from './FilesSettings';
import { NoteCategoryNew } from './NoteCategory';
import { NoteOverlayNew } from './NoteOverlay';
import { NoteSettingNew } from './NoteSetting';

export class NoteSettingsNew {
  public noteCategories: NoteCategoryNew[];
  public noteOverlays: NoteOverlayNew[];
  public noteSettings: NoteSettingNew[];
  public additionalSettings: AdditionalSetting[];
  public filesSettings: FilesSettings;
  public id: string;
  public lang: string;
  public subdomain: string;

  public constructor(
    noteCategories: NoteCategoryNew[],
    noteOverlays: NoteOverlayNew[],
    noteSettings: NoteSettingNew[],
    additionalSettings: AdditionalSetting[],
    filesSettings: FilesSettings,
    lang: string,
    subdomain: string,
  ) {
    this.noteCategories = noteCategories;
    this.noteOverlays = noteOverlays;
    this.noteSettings = noteSettings;
    this.additionalSettings = additionalSettings;
    this.filesSettings = filesSettings;
    this.id = `${lang}-${subdomain}-settings`;
    this.lang = lang;
    this.subdomain = subdomain;
  }
}
