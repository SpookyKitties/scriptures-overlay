import { NextPage } from 'next';
import { NavbarComponents, NavbarProps } from './navbar.component';
import { CSSProperties, Component } from 'react';
import Head from 'next/head';
import '../styles/styles.scss';
import { HeaderComponent } from './header.component';
import { SettingsComponent } from './SettingsComponent';
import Helmet from 'react-helmet';
import { MenuOverlay } from './MenuOverlay';
import { parseSubdomain } from './parseSubdomain';
import { FocusedNotePane } from './verse-notes/FocusedNotePane';
import { NoteEditModalComponent } from './verse-notes/NoteEditModalComponent';
// import { oithMain } from "../styles/typed/chapter-layout";
const oithContentStyles: CSSProperties = {
  height: 'calc(100vh - 48px)',
  display: 'block',
  width: '100vw',
  position: 'fixed',
  top: '48px',
};

export class DisclaimerComponent extends Component {
  public state: { msg: string };

  componentDidMount() {
    const subdomain = parseSubdomain();

    if (subdomain.disclaimer) {
      const oithMain = document.querySelector('.oith-main');
      if (oithMain) {
        oithMain.classList.add('disclaimer');
      }
      switch (subdomain.settings) {
        case 'a':
        case 'june': {
          this.setState({ msg: 'This site is for evaluation purposes only.' });
          break;
        }
        default: {
          this.setState({
            msg: 'These are draft notes that have not yet been reviewed.',
          });
        }
      }
    }
  }

  render() {
    if (this.state && this.state.msg) {
      return (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100vw',
            textAlign: 'center',
            paddingTop: '3px',
            paddingBottom: '3px',
            backgroundColor: 'white',
            height: '32px',
            fontSize: '13px',
            display: 'grid',
            alignItems: 'center',
          }}
        >
          {this.state.msg}
        </div>
      );
    }
    return <></>;
  }
}

const Layout: React.FunctionComponent = ({
  children,
  // title,
  // shortTitle
}) => {
  return (
    <div id="oith-main" className={`oith-main  `}>
      <Helmet>
        <html lang="en" />
        {/* <title>{store ? store.title$.toPromise() : "hhh"}</title> */}
        {/* <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${'UA-153000658-1'}`}
        /> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${'UA-153000658-1'}');
          `,
          }}
        /> */}
      </Helmet>
      <div>h</div>
      <NoteEditModalComponent></NoteEditModalComponent>
      <FocusedNotePane></FocusedNotePane>
      <HeaderComponent></HeaderComponent>
      {children}
      {/* <div className=""></div> */}
      <MenuOverlay />
      <DisclaimerComponent />
    </div>
  );
};

export default Layout;
