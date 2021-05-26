/* eslint-disable @typescript-eslint/ban-types */
import { DocType } from './DocType';
import { VersePlaceholder } from './VersePlaceholder';
import { FormatText } from './FormatText';

export class FormatGroup {
  public grps?: (FormatGroup | FormatText | VersePlaceholder)[];
  public name?: string;
  public attrs?: {};
  public docType: DocType = DocType.FORMATGROUP;

  public constructor(
    name: string,
    grps: (FormatGroup | FormatText | VersePlaceholder)[],
    attrs?: {},
  ) {
    this.name = name;
    this.grps = grps;
    this.attrs = attrs;
  }
}
