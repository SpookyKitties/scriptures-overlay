import { Component } from 'react';
import { NavigationItem } from '../navigation-item';
import { appSettings } from '../SettingsComponent';
import { filterUndefined$ } from '../nextPage';
import { isOpen, OithLink } from './navigation.component';
import { flattenDeep, flatten } from 'lodash';
import Router from 'next/router';
import {
  parse,
  startOfDay,
  isAfter,
  startOfToday,
  isBefore,
  isSameDay,
} from 'date-fns';
import { Subscription } from 'rxjs';

function flattenCFMNav(navItem: NavigationItem): NavigationItem[] {
  if (navItem.navigationItems !== undefined) {
    return flatten(navItem.navigationItems.map(nI => flattenCFMNav(nI)));
  }
  return [navItem];
}

export function gotoComeFollowMe(navItem: NavigationItem) {
  const lesson = flattenCFMNav(navItem)
    .filter(nI => nI.dateEnd !== undefined && nI.dateState !== undefined)
    .map((nI): [NavigationItem, Date, Date] => [
      nI,
      parse(nI.dateState, 'yyyy-MM-dd', new Date()),
      parse(nI.dateEnd, 'yyyy-MM-dd', new Date()),
    ])
    .find(
      nI =>
        (isAfter(startOfToday(), nI[1]) || isSameDay(startOfToday(), nI[1])) &&
        (isBefore(startOfToday(), nI[2]) || isSameDay(startOfToday(), nI[2])),
    );

  if (lesson) {
    Router.push('/[book]/[chapter]', `/${lesson[0].href}`);
  }
}
export class NavItem extends Component<{
  navItem: NavigationItem;
  card?: boolean;
}> {
  public state: {
    navItem: NavigationItem;
    open: boolean;
    title: string;
  };
  private test: Subscription;
  componentDidMount() {
    const title = /([A-Za-z]+)(\d+)/g.exec(this.props.navItem.title);
    this.setState({
      navItem: this.props.navItem,
      open: this.props.navItem.open,
      title: title
        ? `${title[1]}<sup>${title[2]}</sup>`
        : this.props.navItem.title,
    });
    this.test = appSettings.updatenavigation$
      .pipe(filterUndefined$)
      .subscribe(o => {
        this.setState({
          open: this.props.navItem.open,
        });
      });
  }

  componentWillUnmount() {
    if (this.test) {
      this.test.unsubscribe();
    }
  }
  open(navItem: NavigationItem) {
    navItem.open = !navItem.open;
    this.setState({ open: navItem.open });
  }

  render() {
    if (this.state && this.state.navItem) {
      const ni = this.state.navItem;

      if (
        this.props.card &&
        /come.+follow.+me.+2020/g.exec(this.state.navItem.title.toLowerCase())
      ) {
        return (
          <div
            className={`navigation-parent ${this.props.card ? 'card' : ''}`}
            style={{ fontSize: '14px' }}
          >
            <span
              onClick={() => {
                gotoComeFollowMe(ni);
              }}
            >
              <span
                className={`title ${isOpen(ni.open)}`}
                dangerouslySetInnerHTML={{ __html: this.state.title }}
              ></span>
            </span>
          </div>
        );
      }
      if (ni.navigationItems) {
        return (
          <div
            className={`navigation-parent ${this.props.card ? 'card' : ''}`}
            style={{ fontSize: '14px' }}
          >
            <span
              onClick={() => {
                this.open(ni);
              }}
            >
              <span
                className={`title ${isOpen(ni.open)}`}
                dangerouslySetInnerHTML={{ __html: this.state.title }}
              ></span>
            </span>
            <div className={`navigation-child`}>
              {this.state.open ? (
                ni.navigationItems
                  .filter(navItem => !navItem.shortTitle.includes('{'))
                  .map(n => <NavItem card={this.props.card} navItem={n} />)
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className={`${this.props.card ? 'card' : ''}`}>
          <OithLink href={ni.href} active={false}>
            <a className={`title  ${isOpen(ni.open)}`}>
              {ni.open}
              <span
                dangerouslySetInnerHTML={{ __html: this.state.title }}
              ></span>
            </a>
          </OithLink>{' '}
        </div>
      );
    }
    return <></>;
  }
}
