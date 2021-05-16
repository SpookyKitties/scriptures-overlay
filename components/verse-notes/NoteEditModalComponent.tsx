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

// // TinyMCE so the global var exists
// // eslint-disable-next-line no-unused-vars
// import tinymce from 'tinymce/tinymce';
// // Theme
// import 'tinymce/themes/silver';
// // Toolbar icons
// import 'tinymce/icons/default';
// // Editor styles
// import 'tinymce/skins/ui/oxide/skin.min.css';
// import 'tinymce/skins/content/default/content.min.css';
// // importing the plugin js.
// import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/lists';
// import 'tinymce/plugins/charmap';
// import 'tinymce/plugins/hr';
// import 'tinymce/plugins/anchor';
// import 'tinymce/plugins/spellchecker';
// import 'tinymce/plugins/searchreplace';
// import 'tinymce/plugins/wordcount';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/insertdatetime';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/nonbreaking';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/template';
// import 'tinymce/plugins/help';
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
    // tinymce.init({
    //   selector: 'textarea',
    // });
  }

  close() {
    if (this.state && this.state.noteGroup) {
      flattenNoteGroupsRefs(this.state.noteGroup).map(
        ref => (ref.tempValue = undefined),
      );
    }
    showNoteEditModal.next({ display: false });
  }
  save() {
    // Array.from(document.querySelectorAll('[id^=edit-ref')).map(editRef => {
    //   try {
    //     const index = parseInt(last(editRef.id.split('-')));
    //     const ref = flatten(this.state.noteGroup.notes.map(note => note.ref))[
    //       index
    //     ];
    //     // console.log(ref.text);
    //     console.log(editRef);

    //     // ref.text = editRef.innerHTML
    //     //   ?.replace(/&lt;/g, '<')
    //     //   .replace(/&gt;/g, '>');
    //     console.log(decode(editRef.textContent));
    //     ref.text = decode(editRef.textContent).replace(/&nbsp;/g, '\u00A0');
    //   } catch (error) {}
    // });
    if (this.state && this.state.noteGroup) {
      flattenNoteGroupsRefs(this.state.noteGroup)
        .filter(ref => ref.tempValue !== undefined)
        .map(ref => {
          ref.text = decode(ref.tempValue).replace(/\u00B7/g, '\u00a0');
          ref.tempValue = undefined;
        });
      saveChapter().subscribe(() => {
        resetNotes$();
        showNoteEditModal.next({ display: false });
      });
    }
  }

  handleUpdate(value: string, editor: Editor, ref: NoteRef) {
    const content = editor.getContent({ format: 'html' });
    ref.tempValue = decode(content).replace('\u00B7', '\u00a0');
    // console.log(decode(ref.tempValue).replace('\u00B7', '\u00a0'));
    // editor.setContent(decode(content).replace(/\u00a0/g, '\u00B7'));

    // saveChapter().subscribe(() => {
    //   console.log('ioasjdfioajsdfiojioajsdfiojio');

    //   resetNotes$();
    //   // showNoteEditModal.next({ display: false });
    // });
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
                  <EditorComponent
                    initialValue={`${ref.text}`}
                    init={{
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen textpattern',
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
                  // <textarea
                  //   className={`textarea`}
                  //   name=""
                  //   id={`edit-ref-${i}`}
                  //   style={{ width: '100%', height: '100px' }}
                  //   contentEditable="true"
                  // >
                  //   {ref.text}
                  // </textarea>
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
