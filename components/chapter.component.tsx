import Router from 'next/router';
import { Component, CSSProperties, Fragment } from 'react';
import { delay, filter, flatMap, map } from 'rxjs/operators';
import {
  Chapter,
  FormatGroup,
  FormatText,
  VersePlaceholder,
} from '../oith-lib/src/models/Chapter';
import { highlightVerses } from '../oith-lib/src/shells/build-shells';
import { FormatTag } from './format_tag';
import { nextPage, previousPage } from './nextPage';
import { parseSubdomain } from './parseSubdomain';
import { scrollIntoView } from './scrollIntoView';
import { store } from './SettingsComponent';
import { VerseComponent } from './verse.component';
import { VideoComponent } from './VideoComponent';

type ChapterProps = {
  chapter: Chapter;
};

const chapterStyles: CSSProperties = {
  // height: "calc(100vh - 48px)",
  // display: "block",
  // width: "100vw",
  // position: "fixed"
};
const asdf: CSSProperties = {
  // top: '48px',
};

export function renderFormatGroups(
  grps?: (FormatGroup | VersePlaceholder | FormatText)[],
): JSX.Element {
  if (grps) {
    return <Fragment>{grps.map((grp) => renderFormatGroup(grp))}</Fragment>;
  }
  return;
}

export function renderFormat(ft: FormatText) {
  if (ft.formatMerged) {
    try {
      return (
        <Fragment>
          {ft.formatMerged.map((fm) => {
            return (
              <FormatTag formatMerged={fm} offsets={ft.offsets}></FormatTag>
            );
          })}
        </Fragment>
      );
    } catch (error) {
      return <h1>error</h1>;
    }
  }

  return <div>bbbhh</div>;
}

function normalizeAttrs(attrs?: {}) {
  if (attrs) {
    attrs['className'] = attrs['class'];
    attrs['class'] = undefined;
  }
}

function renderFormatGroup(grp: FormatGroup | VersePlaceholder | FormatText) {
  const docType = (grp as FormatGroup).docType;

  switch (docType) {
    case 4: {
      const formatGroup = grp as FormatGroup;
      const attrs = formatGroup.attrs;
      // normalizeAttrs(attrs);
      const elementName = formatGroup.name
        ? formatGroup.name.toLowerCase()
        : '';

      switch (elementName) {
        case 'body':
        case 'div': {
          return (
            <div {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </div>
          );
        }
        case 'header': {
          return (
            <header {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </header>
          );
        }
        case 'span': {
          return (
            <span {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </span>
          );
        }
        case 'small': {
          return (
            <small {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </small>
          );
        }
        case 'br': {
          return <br />;
        }
        case 'img': {
          // return <></>;

          attrs['alt'] = attrs['alt'];
          const src = `${`${attrs['src']}`
            .replace(/\.jpg.*/g, '')
            .replace(/\/images.*images\//g, '')}.jpg`;
          attrs['src'] === undefined;
          return (
            <div className="img-container">
              <img {...attrs} src={`${parseSubdomain().storageURL}${src}`} />
            </div>
          );
        }
        case 'video': {
          return (
            <div className={`media-container`}>
              <VideoComponent
                grp={grp as FormatGroup}
                attrs={attrs}
              ></VideoComponent>
            </div>
          );
          // return <video {...attrs} />;
        }
        case 'a': {
          const href: string | undefined = formatGroup.attrs['href'];
          if (!href || (href && href.includes('note'))) {
            attrs['href'] = undefined;
            return (
              <span {...(attrs ? attrs : {})}>
                {renderFormatGroups(formatGroup.grps)}
              </span>
            );
          } else if (href && href.includes('churchofjesuschrist')) {
            return (
              <a href={href} target={'_blank'}>
                {renderFormatGroups(formatGroup.grps)}
              </a>
            );
          }
          const gotoLink = (href: string) => {
            store.history = false;
            Router.push('/[book]/[chapter]', `${href}`);
          };

          return (
            <a
              className="valid-href"
              onClick={() => {
                gotoLink(href);
              }}
            >
              {renderFormatGroups(formatGroup.grps)}
            </a>
          );
        }
        case '': {
          return <Fragment>{renderFormatGroups(formatGroup.grps)}</Fragment>;
        }
        case 'u': {
          return <u>{renderFormatGroups(formatGroup.grps)}</u>;
        }
        case 'ol': {
          return <ol>{renderFormatGroups(formatGroup.grps)}</ol>;
        }
        case 'p': {
          return <p>{renderFormatGroups(formatGroup.grps)}</p>;
        }
        case 'sup': {
          return <sup>{renderFormatGroups(formatGroup.grps)}</sup>;
        }
        case 'table': {
          return <table>{renderFormatGroups(formatGroup.grps)}</table>;
        }
        case 'thead': {
          return <thead>{renderFormatGroups(formatGroup.grps)}</thead>;
        }
        case 'tbody': {
          return <tbody>{renderFormatGroups(formatGroup.grps)}</tbody>;
        }
        case 'tr': {
          return <tr>{renderFormatGroups(formatGroup.grps)}</tr>;
        }
        case 'td': {
          return <td>{renderFormatGroups(formatGroup.grps)}</td>;
        }
        case 'th': {
          return <th>{renderFormatGroups(formatGroup.grps)}</th>;
        }
        case 'dl': {
          return <dl>{renderFormatGroups(formatGroup.grps)}</dl>;
        }
        case 'dd': {
          return <dd>{renderFormatGroups(formatGroup.grps)}</dd>;
        }
        case 'cite': {
          return <cite>{renderFormatGroups(formatGroup.grps)}</cite>;
        }
        case 'strong': {
          return <strong>{renderFormatGroups(formatGroup.grps)}</strong>;
        }
        case 'em': {
          return <em>{renderFormatGroups(formatGroup.grps)}</em>;
        }
        case 'blockquote': {
          return (
            <blockquote>{renderFormatGroups(formatGroup.grps)}</blockquote>
          );
        }
        case 'nav': {
          return <nav>{renderFormatGroups(formatGroup.grps)}</nav>;
        }
        case 'i': {
          return <i>{renderFormatGroups(formatGroup.grps)}</i>;
        }
        case 'ruby': {
          return <ruby>{renderFormatGroups(formatGroup.grps)}</ruby>;
        }
        case 'rb': {
          return <Fragment>{renderFormatGroups(formatGroup.grps)}</Fragment>;
        }
        case 'rt': {
          return <rt>{renderFormatGroups(formatGroup.grps)}</rt>;
        }
        case 'figure': {
          return <figure>{renderFormatGroups(formatGroup.grps)}</figure>;
        }
        case 'ul': {
          return <ul>{renderFormatGroups(formatGroup.grps)}</ul>;
        }
        case 'li': {
          return <li>{renderFormatGroups(formatGroup.grps)}</li>;
        }
        case 'section': {
          return (
            <section {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </section>
          );
        }
        case 'figcaption': {
          return (
            <figcaption>{renderFormatGroups(formatGroup.grps)}</figcaption>
          );
        }
        default: {
          return (
            <Fragment>
              g|{elementName.toUpperCase()}|g
              {renderFormatGroups(formatGroup.grps)}
            </Fragment>
          );
        }
      }
    }
    case 5: {
      return renderFormat(grp as FormatText);
    }
    default: {
      return (
        <VerseComponent
          verse={(grp as VersePlaceholder).verse}
        ></VerseComponent>
      );
    }
  }
}

function detectswipe(el: string, func: (direct: string) => void) {
  const swipe_det = new Object() as {
    sX: number;
    sY: number;
    eX: number;
    eY: number;
  };
  swipe_det.sX = 0;
  swipe_det.sY = 0;
  swipe_det.eX = 0;
  swipe_det.eY = 0;
  var min_x = 100; //min x swipe for horizontal swipe
  var max_x = 150; //max x difference for vertical swipe
  var min_y = 150; //min y swipe for vertical swipe
  var max_y = 200; //max y difference for horizontal swipe
  var direc = '';
  const ele = document.querySelector(el);
  ele?.addEventListener(
    'touchstart',
    function (e) {
      var t = (e as any).touches[0];
      swipe_det.sX = t.screenX;
      swipe_det.sY = t.screenY;
    },
    false,
  );
  ele?.addEventListener(
    'touchmove',
    function (e) {
      // e.preventDefault();
      var t = (e as any).touches[0];
      swipe_det.eX = t.screenX;
      swipe_det.eY = t.screenY;
    },
    false,
  );
  ele?.addEventListener(
    'touchend',
    function (e) {
      //horizontal detection
      if (
        (swipe_det.eX - min_x > swipe_det.sX ||
          swipe_det.eX + min_x < swipe_det.sX) &&
        swipe_det.eY < swipe_det.sY + max_y &&
        swipe_det.sY > swipe_det.eY - max_y &&
        swipe_det.eX > 0
      ) {
        if (swipe_det.eX > swipe_det.sX) direc = 'r';
        else direc = 'l';
      }
      //vertical detection
      else if (
        (swipe_det.eY - min_y > swipe_det.sY ||
          swipe_det.eY + min_y < swipe_det.sY) &&
        swipe_det.eX < swipe_det.sX + max_x &&
        swipe_det.sX > swipe_det.eX - max_x &&
        swipe_det.eY > 0
      ) {
        if (swipe_det.eY > swipe_det.sY) direc = 'd';
        else direc = 'u';
      }

      func(direc);

      // if (direc != '') {
      //   if (typeof func == 'function') func(el, direc);
      // }
      direc = '';
      swipe_det.sX = 0;
      swipe_det.sY = 0;
      swipe_det.eX = 0;
      swipe_det.eY = 0;
    },
    false,
  );
}

export class ChapterComponent extends Component {
  public state: { chapter: Chapter };
  componentDidMount() {
    store.chapter
      .pipe(
        filter((o) => o !== undefined),
        map((c) => {
          this.setState({ chapter: undefined });

          return c;
        }),
        delay(100),
        map((c) => {
          highlightVerses(c.verses, c.params);
          this.setState({ chapter: c });
          return c;
        }),
        delay(500),
        map((c) => scrollIntoView(c)),
        flatMap((o) => o),
      )
      .subscribe(() => {});

    setTimeout(() => {
      detectswipe('.chapter-loader', (direct) => {
        if (direct === 'l') {
          nextPage();
        }
        if (direct === 'r') {
          previousPage();
        }
      });
    }, 1000);
  }

  componentDidUpdate() {}

  public render() {
    if (this.state && this.state.chapter) {
      // console.log(this.state?.chapter);

      return (
        <div
          className={`chapter-content ${
            this.state &&
            this.state.chapter &&
            !this.state.chapter.id.includes('-come-foll')
              ? ' classic-scriptures'
              : 'manual'
          }`}
        >
          <span
            onClick={() => {
              previousPage();
            }}
            className={'left-nav'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: '#dcdcdc' }}
            >
              <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </span>
          <div
            id={this.state.chapter.id}
            className="chapter"
            style={chapterStyles}
          >
            {renderFormatGroups(this.state.chapter.body.grps)}
          </div>
          <span
            onClick={() => {
              nextPage();
            }}
            className={'right-nav'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ fill: '#dcdcdc' }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" />
              <path fill="none" d="M0 0h24v24H0z" />
            </svg>
          </span>
        </div>
      );
    }
    return <div></div>;
  }
}
