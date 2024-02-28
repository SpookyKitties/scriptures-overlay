import { Component, CSSProperties } from 'react';
import { Subject } from 'rxjs';

const overlay: CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  height: '100vh',
  width: '100vw',
  zIndex: 19,
};

export let menuOverlay$: Subject<Subject<boolean>>;
export class MenuOverlay extends Component {
  public state: { display: boolean; closeMenu$: Subject<boolean> };

  constructor(props) {
    super(props);
  }
  public closeMenu$?: Subject<boolean>;
  componentDidMount() {
    menuOverlay$ = new Subject();
    this.setState({ display: false, closeMenu$: undefined });

    menuOverlay$.subscribe((s) => {
      this.setState({ display: true, closeMenu$: s });
    });
  }
  public click() {
    if (this.state && this.state.closeMenu$) {
      this.state.closeMenu$.next(true);
    }
    this.setState({ display: false, closeMenu$: undefined });
  }
  public render() {
    if (this.state && this.state.display && this.state.closeMenu$) {
      return (
        <div
          onClick={() => {
            this.click();
          }}
          style={overlay}
        ></div>
      );
    }
    return <></>;
  }
}
