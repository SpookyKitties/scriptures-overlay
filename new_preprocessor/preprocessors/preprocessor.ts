import cuid from 'cuid';
import FastGlob from 'fast-glob';
import { emptyDir, readFile, writeFile } from 'fs-extra';
import { JSDOM } from 'jsdom';
import { flatten } from 'lodash';
import normalizePath from 'normalize-path';
import pLimit from 'p-limit';
import { argv } from 'yargs';
import { Chapter } from '../lib/models/Chapter/Chapter';
import { NoteSettingsNew } from '../lib/models/Settings/NoteSettings';
import { chapterProcessor } from './chapter-processor/chapterProcessor';
import { DataContentType } from './DataContentType';
import {
  notesProcessor,
  VerseNotesFile,
} from './notes-processor/notesProcessor';
import { parseDocType } from './parseDocType';
import { processSettingsFiles } from './processSettingsFiles';
import { unzipFile } from './unzipFile';

interface CacheFile {
  content: VerseNotesFile[] | Chapter;
  fileType: string;
}

export async function processNoteFilesNode(
  noteSettings: NoteSettingsNew,
): Promise<void> {
  const limit = pLimit(1);
  await Promise.all(
    noteSettings.filesSettings.overlayFiles.map(overlayFile => {
      return limit(async () => {
        const zipFile = await readFile(
          normalizePath(`./overlays/${noteSettings.lang}/${overlayFile}`),
        );

        const noteZipFile = await unzipFile(zipFile);
        console.log(`loaded ./overlays/${noteSettings.lang}/${overlayFile}`);

        const nf = noteZipFile.map(
          noteFile =>
            new JSDOM(noteFile, { contentType: 'application/xml' }).window
              .document,
        );

        await Promise.all(
          nf.map(async document => {
            const verseNoteFiles = await notesProcessor(document, noteSettings);

            await writeFile(
              normalizePath(`.cache/processed/${cuid() as string}.json`),
              JSON.stringify({
                content: verseNoteFiles,
                fileType: 'verse-note-files',
              } as CacheFile),
            );
          }),
        );
      });
    }),
  );
}

// export function mergeFiles() {}

export async function preprocessor(
  noteSettings: NoteSettingsNew,
  noteFiles: Document[],
): Promise<void> {
  await writeFile(
    normalizePath(`.cache/${noteSettings.lang}/${noteSettings.id}.json`),
    JSON.stringify(noteSettings),
  );
  const limit = pLimit(1);

  console.log(`.cache/processed/${cuid() as string}.json`);
  await Promise.all(
    noteFiles.map(document => {
      return limit(async () => {
        const verseNoteFiles = await notesProcessor(document, noteSettings);

        await writeFile(
          normalizePath(`.cache/processed/${cuid() as string}.json`),
          JSON.stringify({
            verseNoteFiles: verseNoteFiles,
            fileType: 'verse-note-files',
          }),
        );
      });
    }),
  );

  console.log('Notes processed');

  // console.log(chapters.length);

  // return {
  //   noteSettings: noteSettings,
  // };
}
export async function processFile(
  noteSettings: NoteSettingsNew,
  document: Document,
): Promise<Chapter[] | VerseNotesFile[] | undefined> {
  const fileType = await parseDocType(document);
  if (fileType === DataContentType.OVERLAYNOTE) {
    return notesProcessor(document, noteSettings);
  } else if (fileType === DataContentType.SCRIPTURES) {
    return [await chapterProcessor(document)];
  }
  return undefined;
}
export async function mergeNotes(
  verseNoteFiles: VerseNotesFile[],
  chapters: Chapter[],
): Promise<Chapter[]> {
  return await Promise.all(
    chapters.map(chapter => {
      flatten(
        verseNoteFiles
          .filter(verseNoteFile => verseNoteFile.chapterID === chapter.id)
          .map(verseNoteFile => verseNoteFile.verseNotes),
      ).map(verseNote => {
        if (!chapter.verseNotes) {
          chapter.verseNotes = [verseNote];
          return;
        }
        const existingVerseNote = chapter.verseNotes?.find(
          vN => vN.id === verseNote.id,
        );

        if (existingVerseNote) {
          const newNotes = verseNote.notes ? verseNote.notes : [];
          existingVerseNote.notes = existingVerseNote.notes
            ? existingVerseNote.notes.concat(newNotes)
            : newNotes;
        } else {
          chapter.verseNotes = chapter.verseNotes.concat(verseNote);
        }
      });
      return chapter;
    }),
  );
}

export async function mergeFilesNode(
  noteSettings: NoteSettingsNew,
): Promise<void> {
  const filesNames = await FastGlob(
    normalizePath(`.cache/processed/**/*.json`),
  );

  const files = await Promise.all(
    filesNames.map(async fileName => {
      return JSON.parse((await readFile(fileName)).toString()) as CacheFile;
    }),
  );
  const chaptersFiles = files
    .filter(file => file.fileType === 'chapter')
    .map(file => file.content as Chapter);
  const verseNoteFiles = files
    .filter(file => file.fileType === 'verse-note-files')
    .map(file => file.content as VerseNotesFile[]);

  const chapters = await mergeNotes(flatten(verseNoteFiles), chaptersFiles);

  await Promise.all(
    chapters.map(async chapter => {
      await writeFile(
        normalizePath(`.cache/${noteSettings.lang}/${chapter.id}.json`),
        JSON.stringify(chapter),
      );
    }),
  );
}

async function test() {
  await emptyDir(`.cache/processed`);
  try {
    const noteSettings = await processSettingsFileNode();
    await emptyDir(`.cache/${noteSettings.lang}`);

    await writeFile(
      normalizePath(`.cache/${noteSettings.lang}/${noteSettings.id}.json`),
      JSON.stringify(noteSettings),
    );

    await processNoteFilesNode(noteSettings);

    await processScriptureFilesNode(noteSettings);

    await mergeFilesNode(noteSettings);
    // await preprocessor(noteSettings, noteFiles);

    // const chapters = await mergeNotes(files.verseNoteFiles, files.chapters);

    // await Promise.all(
    //   chapters.map(async (chapter) => {
    //     await writeFile(
    //       normalizePath(`.cache/flat/${chapter.id}.json`),
    //       JSON.stringify(chapter),
    //     );
    //   }),
    // );
  } catch (error) {
    console.log(error);
  }
}

test();
async function processSettingsFileNode() {
  const noteSettingsFile = await readFile(
    normalizePath(argv['settings'] as string),
  );
  const noteSettings = await processSettingsFiles(noteSettingsFile);
  return noteSettings;
}

async function processScriptureFilesNode(noteSettings: NoteSettingsNew) {
  const scriptureFilesArchive = await readFile(
    normalizePath(
      `scripture_files/${noteSettings.filesSettings.scripturesArchive}`,
    ),
  );
  const scriptureFiles = await unzipFile(scriptureFilesArchive);
  const limit = pLimit(1);
  const limits = scriptureFiles.map(scriptureFile => {
    return limit(async () => {
      const chapter = await chapterProcessor(
        new JSDOM(scriptureFile).window.document,
      );
      return chapter;
    });
  });
  const chapters = await Promise.all(limits);

  await Promise.all(
    chapters.map(
      async chapter =>
        await writeFile(
          normalizePath(`.cache/processed/${chapter.id as string}.json`),
          JSON.stringify({
            content: chapter,
            fileType: 'chapter',
          } as CacheFile),
        ),
    ),
  );
}
