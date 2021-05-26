import { FilesSettings } from '../../lib/models/Settings/FilesSettings';

export async function parseFileSettings(
  document: Document,
): Promise<FilesSettings> {
  const filesElm = document.querySelector('files');

  const overlayFiles = filesElm?.getAttribute('overlay-filenames')?.split(',');
  const scripturesArchive = filesElm?.getAttribute('scriptures-archive');

  if (overlayFiles && scripturesArchive) {
    return new FilesSettings(overlayFiles, scripturesArchive);
  }

  throw new Error(`No files element found in settings file. Use the following template to add one:
  <files overlay-filenames="eng_overlay_standard.zip,eng_overlay_new.zip" files-folder="note_portal" scriptures-archive="scriptures_eng.zip"/>`);
}
