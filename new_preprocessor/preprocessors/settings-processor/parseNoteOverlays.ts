import { NoteOverlayNew } from '../../lib/models/Settings/NoteOverlay';

export async function parseNoteOverlays(
  document: Document,
): Promise<NoteOverlayNew[]> {
  return Array.from(
    document.querySelectorAll('note-overlays note-overlay'),
  ).map(
    (noteSettingElm: Element): NoteOverlayNew => {
      const name = noteSettingElm.getAttribute('name');
      const className = noteSettingElm.className;
      // const visibility = noteSettingElm.getAttribute('visibility');
      const sort = noteSettingElm.getAttribute('note-overlay');
      if (
        typeof name === 'string' &&
        typeof className === 'string' &&
        typeof sort === 'string'
      ) {
        return new NoteOverlayNew(name, className, parseInt(sort));
      }
      throw new Error(
        `Note Overlay with the follow attributes isn't parsable:
        name: ${name}
        className: ${className}
        Overlay: ${sort}`,
      );
    },
  );
}
