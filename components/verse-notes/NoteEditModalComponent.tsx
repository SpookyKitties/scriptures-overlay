import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

export const showNoteEditModal = new BehaviorSubject<boolean>(false);

export class NoteEditModalComponent extends Component {
  public state: { show: boolean };
  componentDidMount() {
    showNoteEditModal.subscribe(o => {
      console.log(o);

      this.setState({ show: o });
    });
  }
  close() {
    showNoteEditModal.next(false);
  }
  render() {
    if (this.state?.show) {
      return (
        <div className={`modal ${this.state?.show ? 'is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Modal title</p>
              <a
                className="delete"
                aria-label="close"
                onClick={() => this.close()}
              ></a>
            </header>
            <section className="modal-card-body"></section>
            <footer className="modal-card-foot">
              <a className="button is-success">Save changes</a>
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
