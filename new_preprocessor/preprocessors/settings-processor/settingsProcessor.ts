import { NoteSettingsNew } from '../../lib/models/Settings/NoteSettings';
import { parseLang } from '../parseLang';
import { parseFileSettings } from './parseFileSettings';
import { parseAdditionalSettings } from './parseAdditionalSettings';
import { parseNoteCategories } from './parseNoteCategories';
import { parseNoteOverlays } from './parseNoteOverlays';
import { parseNoteSettings } from './parseNoteSettings';
import { parseSubdomain } from './parseSubdomain';

export async function noteSettingsProcessor(
  document: Document,
): Promise<NoteSettingsNew> {
  const noteSettings = await parseNoteSettings(document);
  const noteCategories = await parseNoteCategories(document);
  const noteOverlays = await parseNoteOverlays(document);
  const addionalSettings = await parseAdditionalSettings(document);
  const filesSettings = await parseFileSettings(document);
  const lang = await parseLang(document);
  const subdomain = await parseSubdomain(document);

  return new NoteSettingsNew(
    noteCategories,
    noteOverlays,
    noteSettings,
    addionalSettings,
    filesSettings,
    lang,
    subdomain,
  );
}
