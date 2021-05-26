import { NoteSettingsNew } from '../lib/models/Settings/NoteSettings';
import { parseDocument } from './parseDocument';
import { noteSettingsProcessor } from './settings-processor/settingsProcessor';

export async function processSettingsFiles(
  settingsFile: File | Buffer,
): Promise<NoteSettingsNew> {
  try {
    const document = await parseDocument(settingsFile, 'application/xml');

    return noteSettingsProcessor(document);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
