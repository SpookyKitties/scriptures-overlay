import { AdditionalSetting } from '../../lib/models/Settings/AdditionalSetting';
export async function parseAdditionalSettings(
  document: Document,
): Promise<AdditionalSetting[]> {
  return Array.from(
    document.querySelectorAll('note-settings note-setting'),
  ).map((noteSettingElm: Element): AdditionalSetting => {
    const content = noteSettingElm.getAttribute('enabled');
    const display = noteSettingElm.getAttribute('label');
    const label = noteSettingElm.getAttribute('display');
    const enabled = noteSettingElm.getAttribute('overlays');
    if (
      typeof label === 'string' &&
      typeof content === 'string' &&
      typeof display === 'string' &&
      typeof enabled === 'string'
    ) {
      return new AdditionalSetting(
        label,
        content,
        display.trim() === 'true',
        enabled.trim() === 'true',
      );
    }
    throw new Error(
      `Additional Setting with the following attributes isn't parsable:  
          display: ${display}
          content: ${content}
          enabled: ${enabled} 
          label: ${label} `,
    );
  });
}
