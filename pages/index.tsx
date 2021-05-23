import { NextPage } from 'next';
import { Component } from 'react';
import { NavigationItem } from '../components/navigation-item';
import { NavItem } from '../components/navigation/NavItem';
import { SearchBoxComponent } from '../components/navigation/searchbox.component';
import { initnav } from '../components/nextPage';
import { appSettings } from '../components/SettingsComponent';
import { titleService } from '../components/TitleComponent';
// import { fetch } from "http";
function Testat() {
  return <h1>Test</h1>;
}

// export default function Index(props: string) {
//   return (
//     <div>
//       <Header />
//       {props}
//       <p>Hello Next.js</p>
//       <Testat />
//     </div>
//   );
// }

class Index extends Component {
  public state: { navigation: NavigationItem };

  componentDidMount() {
    appSettings.navigation$.subscribe(o => {
      this.setState({ navigation: o });
      initnav();
    });
    titleService.next(['Library', 'Library']);
  }
  render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;

      return (
        <div className={`navigation`}>
          <SearchBoxComponent />
          <hr />
          <div className={`nav-items-holder`}>
            {this.state.navigation.navigationItems
              .filter(navItem => !navItem.shortTitle.includes('{'))
              .map(ni => {
                return <NavItem card={true} navItem={ni} />;
              })}
            <div
              style={{
                display: 'grid',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <h4>Site Changes</h4>
              <p style={{ maxWidth: '500px' }}>
                Now that the November 2019 New Note Concepts Test is complete,
                we are moving this site back to development mode. You are
                welcome to continue to use it, though the site may be unstable
                at times. The 2020 Come, Follow Me manuals are now available.
              </p>
            </div>
            <div className={`white-space`}></div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}

const IndexPage: NextPage<{}> = ({}) => <Index></Index>;

// IndexPage.getInitialProps = async () => {
//   return {};
// };

export default IndexPage;
