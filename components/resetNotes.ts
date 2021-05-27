import { map, filter, take, flatMap } from 'rxjs/operators';
import { store, appSettings } from './SettingsComponent';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { resetNoteVisibilitySettings } from './resetNoteVisibility';
import { parseSubdomain } from './parseSubdomain';
import {
  VerseNote,
  VerseNoteGroup,
} from '../oith-lib/src/verse-notes/verse-note';
import { groupBy as _groupBy } from 'lodash';

function isNumVisible(verseNote: VerseNote) {
  if (verseNote.vis) {
    const groups = _groupBy(
      verseNote.noteGroups.filter(vng => vng.formatTag.visible),
      vng => vng.id,
    );
    Object.keys(groups).map(key => {
      groups[key].map(g => (g.numVisible = false));
      groups[key][0].numVisible = true;
    });
  }
}

function resetNotes(
  chapter: Chapter, //import("c:/users/jared/source/repos/scriptures-overlay/oith-lib/src/models/Chapter").Chapter
) {
  chapter.verseNotes?.map(verseNote => {
    const v = verseNote.noteGroups.map((noteGroup, i) => {
      const refs = noteGroup.notes.filter(
        n => n.ref.find(r => r.text.includes('video')) !== undefined,
      );
      noteGroup.media = false;

      if (refs.length === 0) {
        setSogloSup(verseNote, i, noteGroup);
      } else {
        const splitid = verseNote.id.split('-');
        noteGroup.num = `${splitid[splitid.length - 3]}`;
        noteGroup.sup = '';
        noteGroup.media = true;
      }
      noteGroup.id = `verse-note-group-${noteGroup.num}${noteGroup.sup}`;

      const v = checkNoteVisiblity(noteGroup);
      return (noteGroup.formatTag.visible = v.includes(true));
    });
    verseNote.vis = v.includes(true);
    isNumVisible(verseNote);
  });
}
function checkNoteVisiblity(noteGroup: VerseNoteGroup) {
  return noteGroup.notes.map(note => {
    // if (note.delete) {
    //   return false;
    // }
    note.formatTag.visible =
      appSettings.settings.vis[
        `nt-${note['overlay'] ? note['overlay'] : note.noteType}`
      ] === true;
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
}

function setSogloSup(
  verseNote: VerseNote,
  i: number,
  noteGroup: VerseNoteGroup,
) {
  const splitid = verseNote.id.split('-');
  const num = `${splitid[splitid.length - 3]}`;
  noteGroup.num = num;
  // if (parseSubdomain().soglo) {
  // const sup = noteGroup.notes[0].sup;
  // noteGroup.sup = sup;
  // noteGroup.notes.map(n => {
  //   n.sup = sup;
  //   n.num = num;
  // });
  // }
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
