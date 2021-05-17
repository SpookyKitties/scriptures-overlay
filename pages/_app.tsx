import React from 'react';
import App from 'next/app';
import Layout from '../components/layout';
import {
  appSettings,
  store,
  SettingsComponent,
} from '../components/SettingsComponent';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { filter, map } from 'rxjs/operators';
import Helmet from 'react-helmet';
import { NavigationItem } from '../components/navigation-item';
import { ExportModal } from '../components/note-offsets/export-modal';
import { PouchyRx } from '../components/import-notes/import-notes/PouchyRx';
export class Store {
  public chapterHistory: Chapter[] = [];
  public updateVerses = new BehaviorSubject<boolean>(true);
  public chapter = new BehaviorSubject<Chapter>(undefined);
  public updateFTags$ = new BehaviorSubject<boolean>(true);
  public resetNotes$ = new BehaviorSubject(undefined);
  public initChapter$ = new BehaviorSubject<Chapter>(undefined);
  public updateNoteVisibility$ = new BehaviorSubject<boolean>(true);
  public editMode$ = new BehaviorSubject<boolean>(true);
  public disableNav$ = new BehaviorSubject<boolean>(false);

  history: boolean;
  public database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);

  public title$ = new BehaviorSubject<string>('Library');

  public constructor() {
    this.setChapterTitle();
  }

  private getScrollTop(selector: string) {
    const chapterLoadElement = document.querySelector(selector);
    return chapterLoadElement ? chapterLoadElement.scrollTop : 0;
  }
  private setChapterTitle() {
    this.chapter
      .pipe(
        filter(o => o !== undefined),
        map(c => this.title$.next(c.title)),
      )
      .subscribe();
  }

  public addToHistory(chapter?: Chapter) {
    if (chapter) {
      chapter.history = true;
      chapter.chapterTop = this.getScrollTop('.chapter-loader');
      chapter.verseNotesTop = this.getScrollTop('.verse-notes');

      this.chapterHistory = this.chapterHistory
        .filter(o => o.id !== chapter.id)
        .concat([chapter]);
    }
  }

  public checkHistory(id: string) {
    if (this.history) {
      return this.chapterHistory.find(c => c.id === id);
    }
    return undefined;
  }

  public checkHistory$(id: string): Observable<Chapter | undefined> {
    return of(this.checkHistory(id));
    if (this.history) {
      return of(this.chapterHistory.find(c => c.id === id));
    }
    return of(undefined);
  }
}
import ReactGA from 'react-ga';
import Head from 'next/head';
import * as viewport from 'viewport-dimensions';
import { NoteModalComponent } from '../components/verse-notes/note-modal';
class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }
  componentDidMount() {
    console.log(ReactGA.initialize([{ trackingId: 'UA-153000658-1' }]));

    if (store) {
      store.title$.subscribe(title => {
        this.setState({ title: title });
      });
    }

    // store = new Store();
    // store.chapter.subscribe(c => {
    //   console.log(c);
    // });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <SettingsComponent></SettingsComponent>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Helmet>
          <title>{this.state ? `${this.state['title']}` : 'z'}</title>
          <link rel="manifest" href="/manifest.json"></link>
        </Helmet>
        <Component {...pageProps} />
        <ExportModal />
        <NoteModalComponent />
      </Layout>
    );
  }
}

export default MyApp;
