import { NoteCategoryNew } from '../../lib/models/Settings/NoteCategory';

export async function parseNoteCategories(
  document: Document,
): Promise<NoteCategoryNew[]> {
  return Array.from(
    document.querySelectorAll('note-categories note-category'),
  ).map(
    (noteSettingElm: Element): NoteCategoryNew => {
      const name = noteSettingElm.getAttribute('name');
      const label = noteSettingElm.getAttribute('label');
      const className = noteSettingElm.getAttribute('class');
      const on = noteSettingElm.getAttribute('on');
      const off = noteSettingElm.getAttribute('on');
      const category = noteSettingElm.getAttribute('note-category');
      if (
        typeof name === 'string' &&
        typeof label === 'string' &&
        typeof className === 'string' &&
        typeof on === 'string' &&
        typeof category === 'string'
      ) {
        return new NoteCategoryNew(
          name,
          label,
          className,
          on.split(','),
          off ? off.split(',') : [],
          parseFloat(category),
        );
      }
      throw new Error(
        `Note Category with the following attributes isn't parsable:
      label: ${label}
      name: ${name}
      className: ${className}
      on: ${on}
      category: ${category}`,
      );
    },
  );
}
