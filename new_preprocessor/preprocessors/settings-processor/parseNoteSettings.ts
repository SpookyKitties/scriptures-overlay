import { NoteSettingNew } from '../../lib/models/Settings/NoteSetting';

export async function parseNoteSettings(
  document: Document,
): Promise<NoteSettingNew[]> {
  return Array.from(
    document.querySelectorAll('note-settings note-setting'),
  ).map(
    (noteSettingElm: Element): NoteSettingNew => {
      const display = noteSettingElm.getAttribute('display');
      const enabled = noteSettingElm.getAttribute('enabled');
      const label = noteSettingElm.getAttribute('label');
      const overlays = noteSettingElm.getAttribute('overlays');
      const categoriesOn = noteSettingElm.getAttribute('categories-on');
      if (
        typeof display === 'string' &&
        typeof enabled === 'string' &&
        typeof label === 'string'
      ) {
        return new NoteSettingNew(
          display.toLowerCase() === 'true',
          enabled.toLowerCase() === 'true',
          label,
          categoriesOn?.split(','),
          overlays?.split(','),
        );
      }
      throw new Error(
        `Note Setting with the following attributes isn't parsable:
          display: ${display}
          enabled: ${enabled}
          label: ${label}
          overlays: ${overlays}
          on: ${categoriesOn}`,
      );
    },
  );
}
