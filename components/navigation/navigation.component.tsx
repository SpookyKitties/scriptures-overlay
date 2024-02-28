import Link from 'next/link';
import Router from 'next/router';
import { Component } from 'react';
import { delay, map } from 'rxjs/operators';
import { appSettings } from '../SettingsComponent';
import { NavigationItem } from '../navigation-item';
import { initnav } from '../nextPage';
import { NavItem } from './NavItem';
import { SearchBoxComponent } from './searchbox.component';
export class OithLink extends Component<{ href: string; active: boolean }> {
  public render() {
    if (this.props.href.includes('churchofjesuschrist.')) {
      return (
        <Link href={`${this.props.href}`} legacyBehavior>
          {this.props.children}
        </Link>
      );
    }
    return (
      <Link as={`/${this.props.href}`} href="/[book]/[chapter]" legacyBehavior>
        {this.props.children}
      </Link>
    );
  }
}

export const isOpen = (open: boolean) => {
  return open ? 'open' : '';
};
export class NavigationComponenet extends Component {
  public state: { navigation: NavigationItem };

  componentDidMount() {
    appSettings.navigation$.subscribe((o) => {
      this.setState({ navigation: o });
      initnav();
    });

    appSettings.updatenavigation$
      .pipe(
        // filterUndefined$,
        delay(100),
        map(() => {
          const titleOpen = document.querySelector('a.title.open');
          // console.log(titleOpen);

          if (titleOpen) {
            titleOpen.scrollIntoView();

            try {
              document.querySelector('.nav-items-holder').scrollTop =
                document.querySelector('.nav-items-holder').scrollTop - 24;
            } catch (error) {}
          }

          // console.log(document.querySelector('.nav-items-holder').scrollHeight);
        }),
      )
      .subscribe((o) => {
        // this.setState({ navigation: undefined });
        // this.setState({ navigation: o });
        // setTimeout(() => {}, 100);
      });
  }
  public goHome() {
    Router.push('/');
  }
  public render() {
    if (this.state && this.state.navigation) {
      const n = this.state.navigation;

      return (
        <div className={`navigation`}>
          <SearchBoxComponent />
          <hr />
          <div
            id="library"
            onClick={() => {
              this.goHome();
            }}
          >
            <span>{this.state.navigation.title}</span>
          </div>
          <hr />
          <div className={`nav-items-holder`}>
            {this.state.navigation.navigationItems.map((ni) => {
              return <NavItem navItem={ni} />;
            })}
            <div className={`white-space`}></div>
          </div>
        </div>
      );
    }
    return <></>;
  }
}
