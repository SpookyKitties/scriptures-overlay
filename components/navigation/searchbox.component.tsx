import Router from 'next/router';
import { Component } from 'react';

const bookNames = [
  ['genesis', 'gen.', 'gen'],
  ['exodus', 'ex.', 'ex'],
  ['leviticus', 'lev.', 'lev'],
  ['numbers', 'num.', 'num'],
  ['deuteronomy', 'deut.', 'deut'],
  ['joshua', 'josh.', 'josh'],
  ['judges', 'judg.', 'judg'],
  ['ruth'],
  ['1 samuel', '1 sam.', '1 sam', '1-sam'],
  ['2 samuel', '2 sam.', '2 sam', '2-sam'],
  ['1 kings', '1 kgs.', '1 kgs', '1-kgs'],
  ['2 kings', '2 kgs.', '2 kgs', '2-kgs'],
  ['1 chronicles', '1 chron.', '1 chron', '1 chr.', '1 chr', '1-chr'],
  ['2 chronicles', '2 chron.', '2 chron', '2 chr.', '2 chr', '2 - chr'],
  ['ezra'],
  ['nehemiah', 'neh.', 'neh'],
  ['esther', 'esth.', 'esth'],
  ['job'],
  ['psalms', 'psalm', 'ps.', 'ps'],
  ['proverbs', 'prov.', 'prov'],
  ['ecclesiastes', 'eccl.', 'eccl'],
  ['song of solomon', 'song'],
  ['isaiah', 'isa.', 'isa'],
  ['jeremiah', 'jer.', 'jer'],
  ['lamentations', 'lam.', 'lam'],
  ['ezekiel', 'ezek.', 'ezek'],
  ['daniel', 'dan.', 'dan'],
  ['hosea'],
  ['joel'],
  ['amos'],
  ['obadiah', 'obad.', 'obad'],
  ['jonah'],
  ['micah'],
  ['nahum'],
  ['habakkuk', 'hab.', 'hab'],
  ['zephaniah', 'zeph.', 'zeph'],
  ['haggai', 'hagai', 'hag.', 'hag'],
  ['zechariah', 'zech.', 'zech'],
  ['malachi', 'mal.', 'mal'],
  ['matthew', 'matt.', 'matt'],
  ['mark'],
  ['luke'],
  ['john'],
  ['acts'],
  ['romans', 'rom.', 'rom'],
  ['1 corinthians', '1 cor.', '1 cor', '1-cor'],
  ['2 corinthians', '2 cor.', '2 cor', '2-cor'],
  ['galatians', 'gal.', 'gal'],
  ['ephesians', 'eph.', 'eph'],
  ['philippians', 'philip.', 'philip'],
  ['colossians', 'col.', 'col'],
  ['1 thessalonians', '1 thes.', '1 thes', '1-thes'],
  ['2 thessalonians', '2 thes.', '2 thes', '2-thes'],
  ['1 timothy', '1 tim.', '1 tim', '1-tim'],
  ['2 timothy', '2 tim.', '2 tim', '2-tim'],
  ['titus'],
  ['philemon', 'philem.', 'philem'],
  ['hebrews', 'heb.', 'heb'],
  ['james'],
  ['1 peter', '1 pet.', '1 pet', '1-pet'],
  ['1 peter', '1 pt.', '1 pt', '1-pet'],
  ['2 peter', '2 pet.', '2 pet', '2-pet'],
  ['2 peter', '2 pt.', '2 pt', '2-pet'],
  ['1 john', '1 jn.', '1 jn', '1-jn'],
  ['2 john', '2 jn.', '2 jn', '2-jn'],
  ['3 john', '3 jn.', '3 jn', '3-jn'],
  ['jude'],
  ['revelation', 'revelations', 'rev.', 'rev'],
  ['1 nephi', '1 ne.', '1 ne', '1-ne'],
  ['2 nephi', '2 ne.', '2 ne', '2-ne'],
  ['jacob'],
  ['enos'],
  ['jarom'],
  ['omni'],
  ['words of mormon', 'w of m', 'wofm', 'w-of-m'],
  ['mosiah'],
  ['alma'],
  ['helaman', 'hel.', 'hel'],
  ['3 nephi', '3 ne.', '3 ne', '3-ne'],
  ['4 nephi', '4 ne.', '4 ne', '4-ne'],
  ['mormon', 'morm.', 'morm'],
  ['ether'],
  ['moroni', 'moro.', 'moro'],
  ['the testimony of three witnesses', 'bofm/three'],
  ['the testimony of eight witnesses', 'bofm/eight'],
  ['the testimony of the prophet joseph smith', 'bofm/js'],
  ['title page of the book of mormon', 'bofm/bofm-title'],
  ['doctrine and covenants', 'sections', 'd&c', 'dc'],
  ['official declaration', 'od'],
  ['moses'],
  ['abraham', 'abr.', 'abr'],
  [
    'joseph smith—matthew',
    'joseph smith–matthew',
    'joseph smith-matthew',
    'joseph smith matthew',
    'js—m',
    'js–m',
    'jsm',
    'js-m',
  ],
  [
    'joseph smith—history',
    'js-h',
    'joseph smith–history',
    'joseph smith-history',
    'joseph smith history',
    'js–h',
    'js—h',
    'jsh',
    'js-h',
  ],
  ['articles of faith', 'a of f', 'aoff', 'a-of-f'],
  ['tg', 'topical guide'],
  ['gs', 'guide to the scriptures'],
  ['bd', 'bible dictionary'],
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
              // console.log(evt.key);
              // console.log(elem.value);

              this.lookUp(elem.value.toLowerCase());
            }
          }}
        />
      </div>
    );
  }
}
