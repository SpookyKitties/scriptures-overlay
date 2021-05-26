import { flatten, last } from 'lodash';
import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  NoteRef,
  VerseNoteGroup,
} from '../../oith-lib/src/verse-notes/verse-note';
import { saveChapter } from '../note-offsets/saveChapter';
import { decode } from 'he';
import { resetNotes$ } from '../resetNotes';
// import tinymce from 'tinymce';
import { Editor as EditorComponent } from '@tinymce/tinymce-react';
import { Editor } from 'tinymce';
import { appSettings } from '../SettingsComponent';
import {
  NoteCategories,
  NoteCategory,
} from '../../oith-lib/src/verse-notes/settings/note-gorup-settings';

export function flattenNoteGroupsRefs(noteGroup: VerseNoteGroup) {
  return flatten(noteGroup.notes.map(note => note.ref));
}

export const showNoteEditModal = new BehaviorSubject<{
  display: boolean;
  noteGroup?: VerseNoteGroup;
}>({ display: false });

export class NoteEditModalComponent extends Component {
  public state: {
    show: boolean;
    noteGroup: VerseNoteGroup;
    noteValues: { index: number; val: string }[];
  };
  componentDidMount() {
    showNoteEditModal.subscribe(o => {
      this.setState({ show: o.display, noteGroup: o.noteGroup });
    });
  }

  close() {
    if (this.state && this.state.noteGroup) {
      flattenNoteGroupsRefs(this.state.noteGroup).map(
        ref => (ref.tempValue = undefined),
      );
    }
    showNoteEditModal.next({ display: false });
  }

  updateCategory(ref: NoteRef) {
    const existingCategory = appSettings.newNoteSettings?.noteCategories.find(
      noteCategory => noteCategory.category === ref.category,
    );
    const replacementCategory = appSettings.newNoteSettings?.noteCategories.find(
      noteCategory => noteCategory.category === ref.tempCategory,
    );
    if (existingCategory && replacementCategory) {
      ref.category = ref.tempCategory;
      ref.text = ref.text?.replace(
        `>${existingCategory.label}`,
        `>${replacementCategory.label}`,
      );
    }
  }
  save() {
    if (this.state && this.state.noteGroup) {
      flattenNoteGroupsRefs(this.state.noteGroup)
        .filter(ref => ref.tempValue !== undefined)
        .map(ref => {
          ref.text = decode(ref.tempValue)
            .replace(/\u00B7/g, '\u00a0')
            .replace(' mceNonEditable', '');
          this.updateCategory(ref);
          ref.tempValue = undefined;
        });
      saveChapter().subscribe(() => {
        resetNotes$();
        showNoteEditModal.next({ display: false });
      });
    }
  }
  changeNoteCategory(ref: NoteRef, noteCategory: NoteCategory, index: number) {
    try {
      // const editor = this.state[`editor${index}`] as Editor;
      // const refVal = decode(editor.getContent({ format: 'html' })).replace(
      //   '\u00B7',
      //   '\u00a0',
      // );
      // console.log(editor);
      // const
      ref.tempCategory = noteCategory.category;
    } catch (error) {}
    this.setState({ [`dropdown-${index}`]: false });
  }
  handleUpdate(value: string, editor: Editor, ref: NoteRef) {
    const content = editor.getContent({ format: 'html' });
    ref.tempValue = decode(content)
      .replace('\u00B7', '\u00a0')
      .replace(' mceNonEditable', '');
  }
  render() {
    if (this.state?.show && this.state?.noteGroup !== undefined) {
      return (
        <div className={`modal ${this.state?.show ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {this.state?.noteGroup?.notePhrase}
              </p>
              <a
                className="delete"
                aria-label="close"
                onClick={() => this.close()}
              ></a>
            </header>
            <section className="modal-card-body">
              {flatten(
                this.state?.noteGroup?.notes?.map(note => note.ref),
              )?.map((ref, i) => {
                return (
                  <div>
                    <div
                      className={`dropdown ${
                        this.state && (this.state[`dropdown-${i}`] as boolean)
                          ? 'is-active'
                          : ''
                      } `}
                    >
                      <div className="dropdown-trigger">
                        <button
                          className="button"
                          aria-haspopup="true"
                          aria-controls="dropdown-menu"
                          onClick={() => {
                            const bool = this.state[`dropdown-${i}`] as boolean;
                            this.setState({ [`dropdown-${i}`]: !bool });
                          }}
                        >
                          <span>Note Category</span>
                          <span className="icon is-small">
                            <i
                              className="fas fa-angle-down"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </button>
                      </div>
                      <div
                        className="dropdown-menu"
                        id="dropdown-menu"
                        role="menu"
                      >
                        <div
                          className="dropdown-content"
                          style={{ height: '100px', overflowY: 'scroll' }}
                        >
                          {appSettings?.newNoteSettings?.noteCategories
                            .filter(
                              noteCategory =>
                                noteCategory.label.trim() !== '' &&
                                noteCategory.label.toLowerCase() !== 'error',
                            )
                            .map(noteCategory => {
                              return (
                                <a
                                  onClick={() => {
                                    this.changeNoteCategory(
                                      ref,
                                      noteCategory,
                                      i,
                                    );
                                  }}
                                  className={`dropdown-item ${
                                    ref.category === noteCategory.category
                                      ? 'is-active'
                                      : ''
                                  }`}
                                >
                                  {noteCategory.label.replace('â˜º', '🔊')}
                                </a>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    <EditorComponent
                      initialValue={`${ref.text.replace(
                        '<span class="small',
                        '<span class="small mceNonEditable',
                      )}`}
                      onInit={(evt, editor) => {
                        this.setState({ [`editor${i}`]: editor });
                      }}
                      init={{
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen textpattern noneditable',
                          'insertdatetime media table paste code help wordcount nonbreaking visualchars',
                        ],
                        toolbar:
                          'undo redo | ' +
                          'bold italic underline link nonbreaking visualchars',
                        visualchars_default_state: true,
                      }}
                      onEditorChange={(value, editor) => {
                        this.handleUpdate(value, editor, ref);
                      }}
                    ></EditorComponent>
                  </div>
                );
              })}
            </section>
            <footer className="modal-card-foot">
              <a className="button is-success" onClick={() => this.save()}>
                Save changes
              </a>
              <a className="button" onClick={() => this.close()}>
                Close
              </a>
            </footer>
          </div>
        </div>
      );
    }
    return <></>;
  }
}
