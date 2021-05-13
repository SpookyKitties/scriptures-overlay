import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

export const showNoteEditModal = new BehaviorSubject<boolean>(false);

export class NoteEditModalComponent extends Component {
  public state: { show: boolean };
  componentDidMount() {
    showNoteEditModal.subscribe(o => this.setState({ show: o }));
  }
  render() {
    if (this.state.show) {
      return <div>test</div>;
    }
    return <></>;
  }
}
