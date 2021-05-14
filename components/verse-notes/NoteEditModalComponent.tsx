import { flatten, last } from 'lodash';
import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import { VerseNoteGroup } from '../../oith-lib/src/verse-notes/verse-note';
import { saveChapter } from '../note-offsets/saveChapter';
import { decode } from 'he';
import { resetNotes$ } from '../resetNotes';
// import tinymce from 'tinymce';
import { Editor } from '@tinymce/tinymce-react';

export const showNoteEditModal = new BehaviorSubject<{
  display: boolean;
  noteGroup?: VerseNoteGroup;
}>({ display: false });

export class NoteEditModalComponent extends Component {
  public state: { show: boolean; noteGroup: VerseNoteGroup };
  componentDidMount() {
    showNoteEditModal.subscribe(o => {
      this.setState({ show: o.display, noteGroup: o.noteGroup });
    });
    // tinymce.init({
    //   selector: 'textarea',
    // });
  }

  close() {
    showNoteEditModal.next({ display: false });
  }
  save() {
    Array.from(document.querySelectorAll('[id^=edit-ref')).map(editRef => {
      try {
        const index = parseInt(last(editRef.id.split('-')));
        const ref = flatten(this.state.noteGroup.notes.map(note => note.ref))[
          index
        ];
        // console.log(ref.text);
        console.log(editRef);

        // ref.text = editRef.innerHTML
        //   ?.replace(/&lt;/g, '<')
        //   .replace(/&gt;/g, '>');
        console.log(decode(editRef.textContent));
        ref.text = decode(editRef.textContent).replace(/&nbsp;/g, '\u00A0');
      } catch (error) {}
    });
    saveChapter().subscribe(() => {
      console.log('ioasjdfioajsdfiojioajsdfiojio');

      resetNotes$();
      showNoteEditModal.next({ display: false });
    });
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
                  <Editor
                    initialValue={`${ref.text}`}
                    plugins={[
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                    ]}
                    toolbar={
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help'
                    }
                  ></Editor>
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
