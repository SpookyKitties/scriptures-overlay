import { map, filter, take, flatMap } from 'rxjs/operators';
import { store, appSettings } from './SettingsComponent';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { resetNoteVisibilitySettings } from './resetNoteVisibility';
import { parseSubdomain } from './parseSubdomain';
import {
  VerseNote,
  VerseNoteGroup,
} from '../oith-lib/src/verse-notes/verse-note';
function resetNotes(
  chapter: Chapter, //import("c:/users/jared/source/repos/scriptures-overlay/oith-lib/src/models/Chapter").Chapter
) {
  chapter.verseNotes.map(verseNote => {
    const v = verseNote.noteGroups.map((noteGroup, i) => {
      setSogloSup(verseNote, i, noteGroup);

      const v = noteGroup.notes.map(note => {
        note.formatTag.visible =
          appSettings.settings.vis[`nt-${note.noteType}`] === true;

        if (note.formatTag.visible) {
          const refVis = note.ref.map(ref => {
            if (ref.label.includes('🔊')) {
              const p = appSettings.noteSettings.addSettings.find(
                ns => ns.additionalcontent === 'pronunciation',
              );
              if (p && p.enabled === false) {
                return (ref.vis =
                  appSettings.settings.vis[`nc-${ref.category}`] === true);
              }
              return (ref.vis = false);
            }
            return (ref.vis =
              appSettings.settings.vis[`nc-${ref.category}`] === true);
          });

          note.formatTag.visible = refVis.includes(true);
        }
        return note.formatTag.visible;
      });
      return (noteGroup.formatTag.visible = v.includes(true));
    });
    verseNote.vis = v.includes(true);
  });
}
function setSogloSup(
  verseNote: VerseNote,
  i: number,
  noteGroup: VerseNoteGroup,
) {
  if (parseSubdomain().soglo) {
    const splitid = verseNote.id.split('-');
    const sup = `${splitid[splitid.length - 3]}${String.fromCharCode(97 + i)}`;
    noteGroup.sup = sup;
  }
}

export function resetNotes$() {
  store.chapter
    .pipe(
      filter(o => o !== undefined),
      map(chapter => {
        return resetNoteVisibilitySettings().pipe(map(() => chapter));
      }),
      flatMap(o => o),
      map(chapter => {
        return resetNotes(chapter);
      }),
    )
    .subscribe(() => {
      store.updateFTags$.next(true);
      store.updateNoteVisibility$.next(true);
    });

  store.resetNotes$
    .pipe(
      map(() =>
        store.chapter.pipe(
          take(1),
          filter(o => o !== undefined),

          map(chapter => {
            return resetNoteVisibilitySettings().pipe(map(() => chapter));
          }),
          flatMap(o => o),
          map(chapter => {
            // resetNotes(chapter);

            resetNotes(chapter);
          }),
        ),
      ),

      flatMap(o => o),
    )
    .subscribe(() => {
      store.updateFTags$.next(true);
      store.updateNoteVisibility$.next(true);
    });
}
