import axios from 'axios';
import { addYears } from 'date-fns';
import { IncomingMessage } from 'http';
import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Component, CSSProperties } from 'react';
import ReactGA from 'react-ga';
import { forkJoin, fromEvent, of } from 'rxjs';
import { filter, flatMap, map, take } from 'rxjs/operators';
import * as viewport from 'viewport-dimensions';
import { langReq } from '../../app/langReq';
import { ChapterComponent } from '../../components/chapter.component';
import { PouchyRx } from '../../components/import-notes/import-notes/PouchyRx';
import { MobileNotesComponent } from '../../components/mobile-notes.tsx/MobileNotesComponent';
import { NavigationComponenet } from '../../components/navigation/navigation.component';
import { parseSubdomain } from '../../components/parseSubdomain';
import { scroll } from '../../components/scroll';
import {
  appSettings,
  resetMobileNotes,
  store,
} from '../../components/SettingsComponent';
import { titleService } from '../../components/TitleComponent';
import { addNotesToVerses$ } from '../../components/verse-notes/addNotesToVerses$';
import { VerseNotesShellComponent } from '../../components/verse-notes/verse-notes-shell';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import {
  addVersesToBody,
  buildShell,
  ChapterParams,
  parseChapterParams,
} from '../../oith-lib/src/shells/build-shells';

export type ImgAttr = {
  src: string;
  alt: string;
};
import Router from 'next/router';

export function reInitChapter() {
  store.chapter
    .pipe(
      take(1),
      filter(o => o !== undefined),
      map(chapter =>
        addVersesToBody(chapter).pipe(
          map(() => buildShell(chapter, chapter.params)),
          flatMap(o => o),
          map(() => chapter),
        ),
      ),
      flatMap(o => o),
    )
    .subscribe(chapter => {
      store.chapter.next(chapter);
    });
}

class OithParent extends Component<{ chapter?: Chapter; lang: string }> {
  state: {
    mobileStyle?: CSSProperties;
    chapterHeight?: string;
    notesMode?: string;
  };
  componentDidMount() {
    appSettings.displayNav$.subscribe(o => {
      this.setState({ displayNav: o });
    });

    appSettings.displayUnderline$.subscribe(o => {
      this.setState({ displayUnderline: o });
    });
    document.cookie = `lang=${this.props.lang}; expires=${addYears(
      new Date(),
      1,
    )}; path=/`;
    appSettings.settings.lang = this.props.lang;
    appSettings.save('settings');

    appSettings.notesMode$.subscribe(o => {
      this.setState({ notesMode: undefined });
      this.setState({ notesMode: o ? o : 'off' });
      // this.setMobileGridStyle();
    });

    // store.initChapter$.next(this.props.chapter);

    Router.push('/[book]/[chapter]', `${location.pathname}`);

    store.initChapter$
      .pipe(
        filter(o => o !== undefined),
        map(chapter => {
          const addVToB = addVersesToBody(chapter).pipe(
            map(() => buildShell(chapter, chapter.params)),
            flatMap(o => o),
            map(() => chapter),
          );
          return forkJoin(addVToB, addNotesToVerses$(chapter));
        }),
        flatMap(o => o),
      )
      .subscribe(chapter => {
        store.chapter.next(chapter[0]);
      });

    store.chapter.pipe(filter(o => o !== undefined)).subscribe(chapter => {
      if (titleService && chapter) {
        titleService.next([chapter.title, chapter.shortTitle]);
      }
      this.setState({ chapter: chapter });
      setTimeout(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }, 200);

      store.disableNav$.next(false);
    });

    this.setMobileGridStyle();

    fromEvent(window, 'resize').subscribe(() => {
      this.setMobileGridStyle();
    });

    resetMobileNotes.subscribe(() => this.setMobileGridStyle());
  }

  private getClasses() {
    const soglo = parseSubdomain().soglo ? 'soglo-chapter' : 'regular-chapter';
    if (this.state) {
      return `${this.state['displayNav'] ? 'nav' : 'nav-off'}  ${
        this.state['notesMode']
      }-notes ${soglo}`;
    }

    return `nav-off ${soglo}`;
  }

  /**
   *  Due to a "feature" of mobile browser, and due the the nature of this website, it is necessary to setup
   * css grid through javascript. Normally when scrolling on mobile browser the "window" of the browser shrinks
   * to show more content. Because of this, the browser treats that originally hidden part as part of the browsers
   * dimensions.
   *
   *  Because of how OneInThineHand handles scrolling, the browser window never shrinks. This means that
   *  there is always a portion of the content that is hidden off the screen. This also means that the 'vh' css
   * unit is unreliable.
   *
   *  Javascript doesn't face this problem. It can give the proper sizes needed for everything
   */
  setMobileGridStyle() {
    try {
      if (window && window.matchMedia(`(max-width: 500px)`).matches) {
        let gridTemplateRows = `calc(${viewport.height()}px - 48px - 48px) 48px`;
        let chapterHeight = `calc(${viewport.height()}px - 48px - 48px)`;
        if (appSettings.settings.notesMode === 'small') {
          chapterHeight = `calc((${viewport.height()}px - 48px)  * .7)`;
          gridTemplateRows = `calc((${viewport.height()}px - 48px)  * .7) calc((${viewport.height()}px - 48px)  * .3)`;
        }
        if (appSettings.settings.notesMode === 'large') {
          chapterHeight = `calc((${viewport.height()}px - 48px)  * .6)`;
          gridTemplateRows = `calc((${viewport.height()}px - 48px)  * .6) calc((${viewport.height()}px - 48px)  * .4)`;
        }

        const style: CSSProperties = {
          gridTemplateRows: gridTemplateRows,
          position: 'fixed',
          top: '48px',
        };
        this.setState({ mobileStyle: style, chapterHeight: chapterHeight });
      } else {
        this.setState({ mobileStyle: undefined, chapterHeight: undefined });
      }
    } catch (error) {
      this.setState({ mobileStyle: undefined, chapterHeight: undefined });
    }
  }

  renderFuture() {
    try {
      if (parseSubdomain().beta) {
        return <MobileNotesComponent />;
      }
    } catch (error) {}
    return <></>;
  }

  render() {
    return (
      <div
        className={`oith-content-parent ${this.getClasses()}`}
        style={
          this.state && this.state.mobileStyle ? this.state.mobileStyle : {}
        }
      >
        <nav className={`oith-navigation`}>
          <NavigationComponenet />
          <div
            className={`mobile-nav-close`}
            onClick={() => {
              appSettings.displayNav();
            }}
          ></div>
        </nav>
        <div
          className={`chapter-loader `}
          style={{
            height:
              this.state && this.state.chapterHeight
                ? this.state.chapterHeight
                : 'initial',
          }}
          onScroll={scroll}
        >
          <ChapterComponent></ChapterComponent>
          <div className="white-space"></div>
        </div>
        {/* {this.renderFuture()} */}

        <VerseNotesShellComponent
          chapter={
            this.state && this.state['chapter']
              ? this.state['chapter']
              : undefined
          }
        ></VerseNotesShellComponent>
      </div>
    );
  }
}

const ChapterParent: NextPage<{ lang: string }> = ({ lang }) => {
  return <OithParent lang={lang}></OithParent>;
};

ChapterParent.getInitialProps = async ({ query, req, res }) => {
  return await loadChapter(req, query);
};

export default ChapterParent;

const port = parseInt(process.env.PORT, 10) || 3000;

async function getChapterRemote(id: string, params: ChapterParams) {
  try {
    const data = await axios.get(
      `${parseSubdomain(params.host).storageURL}${id}.json`,
    );

    const chapter = data.data as Chapter;
    chapter.params = params;

    return chapter;
  } catch (error) {
    return undefined;
  }
  const g = async () => {};
}

async function loadChapter(req: IncomingMessage, query: ParsedUrlQuery) {
  const lang = langReq(req, query);
  const host = req && req.headers ? req.headers.host : location.host;

  const params = parseChapterParams(query, lang, host);

  const id = `${params.lang}-${params.book}-${params.chapter}-chapter`;
  if (store) {
    store.addToHistory(await store.chapter.pipe(take(1)).toPromise());

    store.disableNav$.next(true);
    let chapter = await store
      .checkHistory$(id)
      .pipe(
        map(c => {
          if (c) {
            return of(c);
          }
          store.history = false;

          let database = new PouchyRx(
            `v6-${window.location.hostname}-overlay-org`,
          );
          return database
            .get<Chapter>(
              `${params.lang}-${params.book}-${params.chapter}-chapter`,
            )
            .pipe(
              map(dbItem => {
                if (dbItem) {
                  return dbItem.doc;
                }
                return;
              }),
            );
        }),
        flatMap(o => o),
        map(c => {
          if (c) {
            return of(c);
          }

          return getChapterRemote(id, params);
        }),
        flatMap(o => o),
      )
      .toPromise();

    if (chapter && !store.history) {
      chapter.params = params;
      store.initChapter$.next(chapter);
    } else {
      store.chapter.next(chapter);
    }
    store.history = true;
    return { lang };
  } else {
    // let chapter = await getChapterRemote(id, params);

    return { lang };
  }
}
