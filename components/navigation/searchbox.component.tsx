import Router from 'next/router';
import { Component } from 'react';

const bookNames = [
  ['joseph smith—history', 'js-h/1'],
  ['genesis', 'gen.', 'gen', 'gen', 'gen'],
  ['exodus', 'ex.', 'ex', 'ex'],
  ['leviticus', 'lev.', 'lev', 'lev'],
  ['numbers', 'num.', 'num', 'num'],
  ['deuteronomy', 'deut.', 'deut', 'deut'],
  ['joshua', 'josh.', 'josh', 'josh'],
  ['judges', 'judg.', 'judg', 'judg'],
  ['ruth', 'ruth', 'ruth'],
  ['1 samuel', '1 sam.', '1 sam', '1-sam', '1-sam'],
  ['2 samuel', '2 sam.', '2 sam', '2-sam', '2-sam'],
  ['1 kings', '1 kgs.', '1 kgs', '1-kgs', '1-kgs'],
  ['2 kings', '2 kgs.', '2 kgs', '2-kgs', '2-kgs'],
  ['1 chronicles', '1 chr.', '1 chr', '1-chr', '1-chr'],
  ['1 chronicles', '1 chron.', '1 chron', '1-chr', '1-chr'],
  ['2 chronicles', '2 chr.', '2 chr', '2-chr', '2-chr'],
  ['2 chronicles', '2 chron.', '2 chron', '2-chr', '2-chr'],
  ['ezra', 'ezra', 'ezra'],
  ['nehemiah', 'neh.', 'neh', 'neh'],
  ['esther', 'esth.', 'esth', 'esth'],
  ['job', 'job', 'job'],
  ['psalms', 'psalm', 'ps.', 'ps', 'ps'],
  ['proverbs', 'prov.', 'prov', 'prov'],
  ['ecclesiastes', 'eccl.', 'eccl', 'eccl'],
  ['song of solomon', 'song', 'song'],
  ['isaiah', 'isa.', 'isa', 'isa'],
  ['jeremiah', 'jer.', 'jer', 'jer'],
  ['lamentations', 'lam.', 'lam', 'lam'],
  ['ezekiel', 'ezek.', 'ezek', 'ezek'],
  ['daniel', 'dan.', 'dan', 'dan'],
  ['hosea', 'hosea', 'hosea'],
  ['joel', 'joel', 'joel'],
  ['amos', 'amos', 'amos'],
  ['obadiah', 'obad.', 'obad', 'obad'],
  ['jonah', 'jonah', 'jonah'],
  ['micah', 'micah', 'micah'],
  ['nahum', 'nahum', 'nahum'],
  ['habakkuk', 'hab.', 'hab', 'hab'],
  ['habbakuk', 'hab.', 'hab', 'hab'],
  ['zephaniah', 'zeph.', 'zeph', 'zeph'],
  ['haggai', 'hag.', 'hag', 'hag'],
  ['hagai', 'hag.', 'hag', 'hag'],
  ['zechariah', 'zech.', 'zech', 'zech'],
  ['malachi', 'mal.', 'mal', 'mal'],
  ['matthew', 'matthew', 'matt.', 'matthew', 'matt', 'matt'],
  ['mark', 'mark', 'mark', 'mark'],
  ['luke', 'luke', 'luke'],
  ['john', 'john', 'john'],
  ['acts', 'acts', 'acts'],
  ['romans', 'rom.', 'rom', 'rom'],
  ['1 corinthians', '1 cor.', '1 cor', '1-cor', '1-cor'],
  ['2 corinthians', '2 cor.', '2 cor', '2-cor', '2-cor'],
  ['galatians', 'gal.', 'gal', 'gal'],
  // ['ephesians', 'eph.', 'eph', 'eph'],
  ['philippians', 'philip.', 'philip', 'philip'],
  ['colossians', 'col.', 'col', 'col'],
  ['1 thessalonians', '1 thes.', '1 thes', '1-thes'],
  ['2 thessalonians', '2 thes.', '2 thes', '2-thes'],
  ['1 timothy', '1 tim.', '1 tim', '1-tim', '1-tim'],
  ['2 timothy', '2 tim.', '2 tim', '2-tim', '2-tim'],
  ['titus', 'titus', 'titus'],
  ['philemon', 'philem.', 'philem', 'philem'],
  ['hebrews', 'heb.', 'heb', 'heb'],
  ['james', 'james', 'james'],
  ['1 peter', '1 pet.', '1 pet', '1-pet', '1-pet'],
  ['1 peter', '1 pt.', '1 pt', '1-pet', '1-pet'],
  ['2 peter', '2 pet.', '2 pet', '2-pet', '2-pet'],
  ['2 peter', '2 pt.', '2 pt', '2-pet', '2-pet'],
  ['1 john', '1 jn.', '1 jn', '1-jn', '1-jn'],
  ['2 john', '2 jn.', '2 jn', '2-jn', '2-jn'],
  ['3 john', '3 jn.', '3 jn', '3-jn', '3-jn'],
  ['jude', 'jude', 'jude'],
  ['revelations', 'rev.', 'rev', 'rev'],
  ['1 nephi', '1 ne.', '1 ne.', '1 nephi', '1 ne', '1-ne', '1-ne'],
  ['2 nephi', '2 ne.', '2 ne', '2 ne', '2-ne', '2-ne'],
  ['jacob', 'jacob', 'jacob'],
  ['enos', 'enos', 'enos'],
  ['jarom', 'jarom', 'jarom'],
  ['omni', 'omni', 'omni'],
  ['words of mormon', 'w of m', 'w-of-m', 'words of mormon', 'wofm', 'w-of-m'],
  ['moses', 'pgp', 'moses', 'moses'],
  ['mosiah', 'mosiah', 'mosiah', 'mos', 'mosiah'],
  ['alma', 'alma', 'alma'],
  ['helaman', 'hel.', 'hel', 'hel'],
  ['3 nephi', '3 ne.', '3 ne', '3 ne', '3-ne', '3-ne'],
  ['4 nephi', '4 ne.', '4 ne', '4 ne', '4-ne', '4-ne'],
  ['mormon', 'morm.', 'morm', 'morm'],
  ['ether', 'ether', 'ether'],
  ['moroni', 'moro.', 'moro', 'moro'],
  ['the testimony of three witnesses', 'bofm/three'],
  ['the testimony of eight witnesses', 'bofm/eight'],
  ['the testimony of the prophet joseph smith', 'bofm/js'],
  ['title page of the book of mormon', 'bofm/bofm-title'],
  [
    'doctrine and covenants',
    'sections',
    'dc',
    'doctrine and covenants',
    'd&c',
    'dc',
  ],
  ['official declaration', 'od', 'od'],
  ['abraham', 'abr.', 'abr', 'abr', 'abr'],
  ['ephesians', 'eph.', 'eph', 'eph'],
  [
    'joseph smith— matthew',
    'js—m',
    'js-m',
    'joseph smith–matthew',
    'js–m',
    'js-m',
    'joseph smith-matthew',
    'js-m',
    'js-m',
    'joseph smith matthew',
    'jsm',
    'js-m',
  ],
  [
    'joseph smith—history',
    'js—h',
    'js-h',
    'joseph smith–history',
    'js–h',
    'js-h',
    'joseph smith-history',
    'js-h',
    'js-h',
    'joseph smith history',
    'jsh',
    'js-h',
  ],
  [
    'articles of faith',
    'a of f',
    'a-of-f',
    'articles of faith',
    'aoff',
    'a-of-f',
  ],
  ['tg', 'topical guide', 'tg'],
  ['gs', 'guide to the scriptures', 'gs'],
  ['bd', 'bible dictionary', 'bd'],
];

export class SearchBoxComponent extends Component {
  public lookUp(txt: string) {
    // const textBox = document.getElementById('searchBox');
    // console.log(txt);

    const regex = /^((\d(\s|\-).+?\s)|([a-zA-z].+?\s))(.+)$/g.exec(txt);

    if (regex) {
      const book = bookNames.find(bNs => bNs.find(b => b === regex[1].trim()));
      if (book) {
        console.log(`${book[book.length - 1]}/${regex[regex.length - 1]}`);
        Router.push(
          '/[book]/[chapter]',
          `/${book[book.length - 1]}/${regex[regex.length - 1].replace(
            ':',
            '.',
          )}`,
        );
        return;
      }
    }
  }
  public render() {
    // if (this.props.navigation) {
    //   return <div></div>;
    // }

    return (
      <div>
        <input
          type="search"
          name="search"
          id="searchBox"
          placeholder="Look Up"
          onKeyDown={evt => {
            const elem = evt.target as HTMLInputElement;
            if (evt.key.toLowerCase() === 'enter') {
              console.log(evt.key);
              this.lookUp(elem.value);
            }
          }}
        />
      </div>
    );
  }
}
