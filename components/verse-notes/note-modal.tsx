import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

export let noteModal: BehaviorSubject<'pronunciation' | 'geo' | undefined>;

export class NoteModalComponent extends Component {
  public state: { msg?: 'pronunciation' | 'geo' };

  renderPronunciation() {
    return (
      <div>
        <figure className={`table`} id="figure1">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure1_p1">
                    ǝ
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure1_p2">
                    <em>a</em> in <em>a</em>bout, <em>e</em> in tak<em>e</em>n,{' '}
                    <em>i</em> in penc<em>i</em>l, <em>o</em> in lem<em>o</em>n,{' '}
                    <em>u</em> in circ<em>u</em>s or n<em>u</em>t
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure2">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure2_p1">
                    ā
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure2_p2">
                    long <em>a</em> as in <em>a</em>ble, b<em>a</em>ke, w
                    <em>a</em>y
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure2_p3">
                    ă
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure2_p4">
                    as in <em>a</em>sk, p<em>a</em>t, m<em>a</em>p
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure2_p5">
                    ä
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure2_p6">
                    as in <em>a</em>lms, f<em>a</em>ther, c<em>a</em>ll
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure2_p7">
                    är
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure2_p8">
                    as in <em>ar</em>my
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure2_p9">
                    äw
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure2_p10">
                    as in l<em>aw</em>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure3">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure3_p1">
                    ē
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure3_p2">
                    long <em>e</em> as in <em>e</em>at, m<em>ee</em>t, m
                    <em>e</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure3_p3">
                    ēr
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure3_p4">
                    as in <em>ear</em>, h<em>ere</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure3_p5">
                    ĕ
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure3_p6">
                    as in <em>e</em>bb, m<em>e</em>t, s<em>e</em>cond
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure3_p7">
                    ĕr
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure3_p8">
                    as in <em>air</em>, f<em>are</em>, <em>er</em>ror
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure3_p9">
                    er
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure3_p10">
                    as in p<em>er</em>mit
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure4">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure4_p1">
                    ī
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure4_p2">
                    long <em>i </em>as in <em>i</em>dle, f<em>i</em>ne, den
                    <em>y</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure4_p3">
                    ing
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure4_p4">
                    as in r<em>ing</em>, k<em>ing</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure4_p5">
                    ĭ
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure4_p6">
                    short <em>i </em>as in <em>i</em>t, h<em>i</em>m, m
                    <em>i</em>rror
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure5">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure5_p1">
                    j
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure5_p2">
                    as in <em>j</em>udge, bri<em>dg</em>e
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure6">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p1">
                    ō
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p2">
                    long <em>o</em> as in <em>o</em>ver, b<em>o</em>ne, kn
                    <em>o</em>w
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p3">
                    ōr
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p4">
                    as in f<em>or</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p5">
                    ōi
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p6">
                    as in b<em>oy</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p7">
                    o
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p8">
                    as in n<em>o</em>t or p<em>o</em>t
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p9">
                    ou
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p10">
                    as in c<em>ou</em>nt, ab<em>ou</em>t, c<em>ow</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure6_p11">
                    oor
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure6_p12">
                    as in p<em>oor</em>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure7">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure7_p1">
                    ū
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure7_p2">
                    as in r<em>u</em>le, b<em>oo</em>t, tw<em>o</em>
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure7_p3">
                    yū
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure7_p4">
                    as in <em>Yu</em>le, <em>u</em>rim
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure7_p5">
                    uu
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure7_p6">
                    as in r<em>ou</em>gh
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure7_p7">
                    uo
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure7_p8">
                    as in p<em>u</em>t, b<em>u</em>ll
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure className={`table`} id="figure8">
          <table>
            <tbody>
              <tr>
                <td>
                  <p data-aid="" id="figure8_p1">
                    ch
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure8_p2">
                    usually as in <em>ch</em>ill, <em>ch</em>imney
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure8_p3">
                    th
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure8_p4">
                    as in <em>th</em>em, sometimes <em>th</em>ick
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure8_p5">
                    zh
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure8_p6">
                    as in mea<em>s</em>ure
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure8_p7">
                    hw
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure8_p8">
                    as in <em>wh</em>ile
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p data-aid="" id="figure8_p9">
                    sh
                  </p>
                </td>
                <td>
                  <p data-aid="" id="figure8_p10">
                    as in <em>sh</em>e
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
      </div>
    );
  }
  renderGeo() {
    return <div></div>;
  }

  modalToRender() {
    switch (this.state.msg) {
      case 'pronunciation': {
        return this.renderPronunciation();
      }
      case 'geo': {
        return this.renderGeo();
      }
    }
  }

  renderModal() {
    return (
      <div className={`modal is-active`}>
        <div
          onClick={() => this.close()}
          className={`modal-background`}
          style={{ backgroundColor: 'unset' }}
        ></div>
        <div className={`modal-card`} style={{ maxHeight: '50vh' }}>
          <header className={`modal-card-head`}>
            <p className={`modal-card-title`}>Modal title</p>
            <a
              onClick={() => this.close()}
              className={`delete`}
              aria-label="close"
            ></a>
          </header>
          <section className={`modal-card-body`}>
            {this.modalToRender()}{' '}
          </section>
          {/* <footer className={`modal-card-foot`}>
            <button className={`button is-success`}>Save changes</button>
            <button className={`button`}>Cancel</button>
          </footer> */}
        </div>
      </div>
    );
  }

  componentDidMount() {
    noteModal = new BehaviorSubject(undefined);

    noteModal.subscribe(o => {
      this.setState({ msg: o });
    });
  }
  close() {
    noteModal.next(undefined);
  }

  render() {
    if (this.state && this.state.msg !== undefined) {
      return this.renderModal();
    }
    return <></>;
  }
}
